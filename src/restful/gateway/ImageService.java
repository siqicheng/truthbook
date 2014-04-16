package restful.gateway;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
import db.mapping.object.Relationship;
import db.mapping.object.User;
import db.mapping.object.UserDAO;

@Path("imageService")
public class ImageService {
	
	private ImageDAO imageDAO;
	
	
	public ImageService(){
		imageDAO = new ImageDAO();
		
	}
	
	@GET
	@Path("v1/image/latest")
	@Produces("application/json;charset=utf-8")
	public Object getLatestImage(){
		return null;
	}
	
	@POST
	@Path("v1/image/add")
	@Produces("application/json;charset=utf-8")
	public Object addImage(@FormParam("imageURL") String imageURL,
			@FormParam("userId") Integer userId,
			@FormParam("uploaderId") Integer uploaderId) {
		
		Session session = this.imageDAO.getSession();
		try{
			Transaction tx = session.beginTransaction();			
			
			UserDAO userdao= new UserDAO();
			User user= userdao.findById(userId);
			
			Image image = new Image();
			image.setImageUrl(imageURL);
			image.setUploaderId(uploaderId);
			image.setUser(user);
			
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
	public Image getImageById(@PathParam("imageId") Integer imageId) {
		Image image = new Image();
		image = this.imageDAO.findById(imageId);
		if (image!=null && image.getDeleted()){
			image = null;
		}
		return image;
		
	}
	
	@GET
	@Path("v1/image/{userId}/userId")
	@Produces("application/json;charset=utf-8")
	public Image[] getImagesByUser(@PathParam("userId") Integer userId) {
		String property[] = {Image.USER_ID,Image.DELETED};
		Object value[] = {userId,false};
		
		List images = this.imageDAO.findByProperties(property, value, Image.TABLE);
		
		if (images.size() > 0){
			List image_list = new ArrayList();
			for (Object image : images){
				if (image instanceof Image){
					if (image!= null){
						image_list.add(image);
					}					
				}				
			}
			Image[] image = new Image[image_list.size()];
			for (int i=0; i<image_list.size();i++){
				image[i] = (Image) image_list.get(i);
			}
			
			return image;
		}
		return null;		
	}
	
	@GET
	@Path("v1/image/{uploaderId}/uploaderId")
	@Produces("application/json;charset=utf-8")
	public Image[] getImagesByUploader(@PathParam("uploaderId") Integer uploaderId) {
		String property[] = {Image.UPLOADER_ID,Image.DELETED};
		Object value[] = {uploaderId,false};
		
		List images = this.imageDAO.findByProperties(property, value, Image.TABLE);
		
		if (images.size() > 0){
			List image_list = new ArrayList();
			for (Object image : images){
				if (image instanceof Image){
					if (image!= null){
						image_list.add(image);
					}					
				}				
			}
			Image[] image = new Image[image_list.size()];
			for (int i=0; i<image_list.size();i++){
				image[i] = (Image) image_list.get(i);
			}
			
			return image;
		}
		return null;		
	}
	
	@PUT
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