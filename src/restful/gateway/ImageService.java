package restful.gateway;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import org.hibernate.Session;
import org.hibernate.Transaction;
import db.mapping.object.Image;
import db.mapping.object.ImageDAO;
import db.mapping.object.User;
import db.mapping.object.UserDAO;


@Path("imageService")
public class ImageService {
	
	private ImageDAO imageDAO;
	
	
	public ImageService(){
		imageDAO = new ImageDAO();
		
	}
	
	private static Map ProduceMap(Image image){
		if (image==null) {
			return null;
		}
		
		Map<String,Object> map =new HashMap<String,Object>();
		map.put("commentCnt", image.getImageComments().size());
		map.put("imageId", image.getImageId());
		map.put("imageUrl", image.getImageUrl());
		map.put("approved", image.getApproved());
		map.put("like", image.getLiked());
		map.put("description", image.getContent());
		map.put("createDate", image.getCreateDate().toString());
		map.put("uploaderId", image.getUploaderId());
		map.put("userId", image.getUserId());
		map.put("userName", image.getUser().getFullName());
		map.put("uploaderName", new UserDAO().findById(image.getUploaderId()).getFullName());
		
		
		return map;
	}
	
//	@GET
//	@Path("v1/image/{imageid}/{imageSize}/resizedImage")
//	@Produces("image/jpeg")
//	public Object getImage(@PathParam("imageid") Integer imageid, 
//			@PathParam("imageSize") String imageSize){
//		
//		try{
////			String path =new ImageDAO().findById(imageid).getImageUrl();
//			String path = 
//					"C:\\Users\\WinKaR\\Workspaces\\MyEclipse Professional\\.metadata\\.me_tcat7\\webapps\\truthbook\\Uploaded\\Koala.jpg";
////			File image = new File(path);
//////			return image.;
////			File file = new File(path);
////			 
////			ResponseBuilder response = Response.ok((Object) file);
////			response.header("Content-Disposition",
////				"attachment; filename=image_from_server.png");
////			return response.build();
//			
//			BufferedInputStream in = new BufferedInputStream(new FileInputStream(path));
//			ByteArrayOutputStream out =new  ByteArrayOutputStream();
//			int size=0;
//			byte[] temp = new byte[1024];        
//			while ((size = in.read(temp))!=-1){
//				out.write(temp, 0, size);        
//			}
//			in.close();
//			return Response.ok(out.toByteArray()).build();
//		} catch (Exception e){
//			e.printStackTrace();
//			
//			return null;
//		}
//	}
	
	@GET
	@Path("v1/image/{userid}/latest")
	@Produces("application/json;charset=utf-8")
	public Object getLatestImage(@PathParam("userid") Integer userId){
		User user = new UserDAO().findById(userId);
		Set set = user.getImages();
		Image latest = null;
		for (Object image : set){
			if (image instanceof Image && !((Image) image).getDeleted()){
				if (latest==null || ((Image)image).getLastModified().after(latest.getLastModified())){
					latest = (Image) image;
				}
			}
		}
		
		Object[] images = new Object[1];
		
		images[0] = ProduceMap(latest);
		
		return RestUtil.array2json(images);
	}
	
	@POST
	@Path("v1/image/add")
	@Produces("application/json;charset=utf-8")
	public Object addImage(@FormParam("imageURL") String imageURL,
			@FormParam("userId") Integer userId,
			@FormParam("uploaderId") Integer uploaderId,
			@FormParam("description") String content) {
		
		Session session = this.imageDAO.getSession();
		try{
			Transaction tx = session.beginTransaction();			
			
			UserDAO userdao= new UserDAO();
			User user= userdao.findById(userId);
			
			Image image = new Image();
			image.setImageUrl(imageURL);
			image.setUploaderId(uploaderId);
			image.setUser(user);
			image.setContent(content);
			
			Date date = RestUtil.getCurrentDate();
			
			image.setCreateDate(date);
			image.setLastModified(date);
			image.setApproved(false);
			image.setDeleted(false);
			
			session.save(image);	
			tx.commit();
			session.close();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			session.close();
		}
		return RestUtil.string2json("false");
	}
	
	@GET
	@Path("v1/image/{imageId}/id")
	@Produces("application/json;charset=utf-8")
	public Object getImageById(@PathParam("imageId") Integer imageId) {
		Image image = new Image();
		image = this.imageDAO.findById(imageId);
		if (image!=null && image.getDeleted()){
			image = null;
		}
		//return image;
		return RestUtil.map2json(ProduceMap(image));
	}
	
	@GET
	@Path("v1/image/{userId}/user")
	@Produces("application/json;charset=utf-8")
	public Object getImagesByUser(@PathParam("userId") Integer userId) {

		User user = new UserDAO().findById(userId);
		
		Set set = user.getImages();
		
		List image_list = new ArrayList();
		for (Object image : set){
			if (image instanceof Image && !((Image) image).getDeleted() ){
				image_list.add(image);
			}
		}
		
//		Image[] images = new Image[image_list.size()];
//		
//		for (int i=0; i<image_list.size();i++){
//			images[i] = (Image) image_list.get(i);
//		}
		
		Object[] images = new Object[image_list.size()];
		
		for (int i=0; i<image_list.size(); i++){
			images[i] = ProduceMap((Image) image_list.get(i));
		}
		
		return RestUtil.array2json(images);
		
		
	}
	
	@GET
	@Path("v1/image/{uploaderId}/uploader")
	@Produces("application/json;charset=utf-8")
	public Object getImagesByUploader(@PathParam("uploaderId") Integer uploaderId) {
		String property[] = {Image.UPLOADER_ID,Image.DELETED};
		Object value[] = {uploaderId,false};
		
		List images = this.imageDAO.findByProperties(property, value, Image.TABLE);
		
		if (images.size() > 0){
			List image_list = new ArrayList();
			for (Object image : images){
				if (image instanceof Image && !((Image) image).getDeleted()){
					if (image!= null){
						image_list.add(image);
					}					
				}				
			}
//			Image[] image = new Image[image_list.size()];
//			for (int i=0; i<image_list.size();i++){
//				image[i] = (Image) image_list.get(i);
//			}
//			
//			return image;
			
			Object[] image = new Object[image_list.size()];
			
			for (int i=0; i<image_list.size(); i++){
				image[i] = ProduceMap((Image) image_list.get(i));
			}
			
			return RestUtil.array2json(image);
		}
		return null;		
	}
	@GET
	@Path("v1/image/{imageId}/like")
	@Produces("application/json;charset=utf-8")
	public Object likeImage(@PathParam("imageId") Integer imageId){
		Image image =(Image) this.imageDAO.findById(imageId);
		
		if (image.getDeleted()){
			return RestUtil.string2json("false");
		}
		Session session = this.imageDAO.getSession();
		try{
			image.setLiked(image.getLiked()+1);
			Transaction tx = session.beginTransaction();
			session.update(image);
			tx.commit();
			session.close();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			session.close();
			return RestUtil.string2json("false");
		}
		
		
	}
	
	@GET
	@Path("v1/image/{imageId}/dislike")
	@Produces("application/json;charset=utf-8")
	public Object dislikeImage(@PathParam("imageId") Integer imageId){
		Image image =(Image) this.imageDAO.findById(imageId);
		
		if (image.getDeleted()){
			return RestUtil.string2json("false");
		}
		Session session = this.imageDAO.getSession();
		try{
			image.setLiked(image.getLiked()-1);
			Transaction tx = session.beginTransaction();
			session.update(image);
			tx.commit();
			session.close();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			session.close();
			return RestUtil.string2json("false");
		}
		
		
	}
	
	@GET
	@Path("v1/image/{imageId}/approve")
	@Produces("application/json;charset=utf-8")
	public Object approveImage(@PathParam("imageId") Integer imageId) {
		Image image = new Image();
		image = this.imageDAO.findById(imageId);
		if (image.getDeleted()){
			return RestUtil.string2json("false");
		}
		if (image.getApproved()){
			return RestUtil.string2json("true");
		}else{
			Session session = this.imageDAO.getSession();
			try{
				Transaction tx = session.beginTransaction();
				image.setApproved(true);
				image.setLastModified(RestUtil.getCurrentDate());
				session.update(image);
				tx.commit();
				session.close();
				return RestUtil.string2json("true");
			}catch (Exception e){
				e.printStackTrace();
				session.close();
				return RestUtil.string2json("false");
			}
		}	
	}
	
	@PUT
	@Path("v1/image/{imageId}/unapprove")
	@Produces("application/json;charset=utf-8")
	public Object unapproveImage(@PathParam("imageId") Integer imageId) {
		Image image = new Image();
		image = this.imageDAO.findById(imageId);
		if (image.getDeleted()){
			return RestUtil.string2json("false");
		}
		if (!image.getApproved()){
			return RestUtil.string2json("true");
		}else{
			Session session = this.imageDAO.getSession();
			try{
				Transaction tx = session.beginTransaction();
				image.setApproved(false);
				image.setLastModified(RestUtil.getCurrentDate());
				session.update(image);
				tx.commit();
				session.close();
				return RestUtil.string2json("true");
			}catch (Exception e){
				e.printStackTrace();
				session.close();
				return RestUtil.string2json("false");
			}
		}	
	}
	
	@PUT
	@Path("v1/image/{imageId}/delete")
	@Produces("application/json;charset=utf-8")
	public Object deleteImage(@PathParam("imageId") Integer imageId) {
		Image image = new Image();
		image = this.imageDAO.findById(imageId);
		if (image.getDeleted()){
			return RestUtil.string2json("true");
		}else{
			Session session = this.imageDAO.getSession();
			try{
				Transaction tx = session.beginTransaction();
				image.setDeleted(true);
				image.setLastModified(RestUtil.getCurrentDate());
				session.update(image);
				tx.commit();
				session.close();
				return RestUtil.string2json("true");
			}catch (Exception e){
				e.printStackTrace();
				session.close();
				return RestUtil.string2json("false");
			}
		}
	}
	
	@PUT
	@Path("v1/image/{imageId}/restore")
	@Produces("application/json;charset=utf-8")
	public Object restoreImage(@PathParam("imageId") Integer imageId) {
		Image image = new Image();
		image = this.imageDAO.findById(imageId);
		if (!image.getDeleted()){
			return RestUtil.string2json("true");
		}else{
			Session session = this.imageDAO.getSession();
			try{
				Transaction tx = session.beginTransaction();
				image.setDeleted(false);
				image.setLastModified(RestUtil.getCurrentDate());
				session.update(image);
				tx.commit();
				session.close();
				return RestUtil.string2json("true");
			}catch (Exception e){
				e.printStackTrace();
				session.close();
				return RestUtil.string2json("false");
			}
		}
	}
	
}