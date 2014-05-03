package restful.gateway;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

import db.mapping.object.Image;
import db.mapping.object.Message;
import db.mapping.object.Relationship;
import db.mapping.object.User;
import db.mapping.object.DAO.ImageDAO;
import db.mapping.object.DAO.RelationshipDAO;
import db.mapping.object.DAO.UserDAO;


@Path("imageService")
public class ImageService {
	
	private ImageDAO imageDAO;
	private RelationshipDAO relationshipDAO;
	private UserDAO userDAO;
	
	public ImageService(){
		imageDAO = new ImageDAO();
		relationshipDAO = new RelationshipDAO();
		userDAO = new UserDAO();
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
	
	@GET
	@Path("v1/image/{userid}/latest")
	@Produces("application/json;charset=utf-8")
	public Object getLatestImage(@PathParam("userid") Integer userId,
			@HeaderParam("token") String token){
		User user = new UserDAO().findById(userId);
//		if (!user.getToken().equals(token)){
//			return null;
//		}
		Set set = user.getImages();
		Image latest = null;
		for (Object image : set){
			if (image instanceof Image && !((Image) image).getDeleted() 
					&& ((Image)image).getApproved()){
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
			Relationship relat = this.relationshipDAO.findByUserAndFriend(user, uploaderId);
			if (relat == null ){
				return RestUtil.string2json("false");
			}
			
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
//			session.close();
			this.imageDAO.closeSession();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
//			session.close();
			this.imageDAO.closeSession();
		}
		return RestUtil.string2json("false");
	}
	
	@GET
	@Path("v1/image/{imageId}/id")
	@Produces("application/json;charset=utf-8")
	public Object getImageById(@PathParam("imageId") Integer imageId,
			@HeaderParam("token") String token) {
		try {
			Image image = this.imageDAO.findById(imageId);
			
			User user = image.getUser();
			//判断是否是本人，或与本人是好友
			if (!user.getToken().equals(token)){
				List friend = this.userDAO.findByToken(token);
				if (friend == null){
					return null;
				}
				Relationship relat = this.relationshipDAO.findByUserAndFriend(user, ((User)friend.get(0)).getUserId());
				if (relat == null){
					return null;
				}
			}
			return RestUtil.map2json(ProduceMap(image));
		} catch (Exception e){
			e.printStackTrace();
			return null;
		}
		
	}
	
	@GET
	@Path("v1/image/{userId}/user")
	@Produces("application/json;charset=utf-8")
	public Object getImagesByUser(@PathParam("userId") Integer userId,
			@HeaderParam("token") String token) {
		Session session = this.imageDAO.getSession();
		try{
			User user = this.userDAO.findById(userId);
			
			//判断是否是本人，或与本人是好友
			if (!user.getToken().equals(token)){
				List friend = this.userDAO.findByToken(token);
				if (friend == null){
					return null;
				}
				Relationship relat = this.relationshipDAO.findByUserAndFriend(user, ((User)friend.get(0)).getUserId());
				if (relat == null){
					return null;
				}
			}
			Criteria criteria = session.createCriteria(Image.class);
			List<Image> image_list = criteria
					.add(Restrictions.eq(ImageDAO.USER, user))
					.add(Restrictions.ne(ImageDAO.DELETED, true))
					.list();
			Object[] images = new Object[image_list.size()];
			
			for (int i=0; i<image_list.size(); i++){
				images[i] = ProduceMap((Image) image_list.get(i));
			}
//			session.close();
			
			Object test = RestUtil.array2json(images);
			this.imageDAO.closeSession();
			return RestUtil.array2json(images);
		} catch (Exception e){
//			session.close();
			this.imageDAO.closeSession();
			e.printStackTrace();
			return null;
		}
	}
	
	@GET
	@Path("v1/image/{uploaderId}/uploader")
	@Produces("application/json;charset=utf-8")
	public Object getImagesByUploader(@PathParam("uploaderId") Integer uploaderId,
			@HeaderParam("token") String token) {
		
		try{
			User uploader = this.userDAO.findById(uploaderId);
			if (!uploader.getToken().equals(token)){
				return null;
			}
			String property[] = {ImageDAO.UPLOADER_ID,ImageDAO.DELETED};
			Object value[] = {uploaderId,false};
			
			List images = this.imageDAO.findByProperties(property, value, ImageDAO.TABLE);
			
			if (images.size() > 0){
				List image_list = new ArrayList();
				for (Object image : images){
					if (image instanceof Image && !((Image) image).getDeleted()){
						if (image!= null){
							image_list.add(image);
						}					
					}				
				}
				Object[] image = new Object[image_list.size()];
				
				for (int i=0; i<image_list.size(); i++){
					image[i] = ProduceMap((Image) image_list.get(i));
				}
				
				return RestUtil.array2json(image);
			}
			return null;		
		} catch (Exception e){
			e.printStackTrace();
			return null;
		}
		
	}
	@GET
	@Path("v1/image/{imageId}/like")
	@Produces("application/json;charset=utf-8")
	public Object likeImage(@PathParam("imageId") Integer imageId){
		Image image =(Image) this.imageDAO.findById(imageId);
		Session session = this.imageDAO.getSession();
		try{
			if (image.getDeleted()){
				return RestUtil.string2json("false");
			}
			image.setLiked(image.getLiked()+1);
			Transaction tx = session.beginTransaction();
			session.update(image);
			tx.commit();
//			session.close();
			this.imageDAO.closeSession();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
//			session.close();
			this.imageDAO.closeSession();
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
//			session.close();
			this.imageDAO.closeSession();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
//			session.close();
			this.imageDAO.closeSession();
			return RestUtil.string2json("false");
		}
		
		
	}
	
	@GET
	@Path("v1/image/{imageId}/approve")
	@Produces("application/json;charset=utf-8")
	public Object approveImage(@PathParam("imageId") Integer imageId,
			@HeaderParam("token") String token) {
		Image image = new Image();
		image = this.imageDAO.findById(imageId);
		if (image==null ||!image.getUser().getToken().equals(token)){
			return RestUtil.string2json("false");
		}
		if (image.getDeleted()){
			return RestUtil.string2json("false");
		}
		if (image.getApproved()){
			return RestUtil.string2json("true");
		}
		Session session = this.imageDAO.getSession();
		try{
			Transaction tx = session.beginTransaction();
			image.setApproved(true);
			image.setLastModified(RestUtil.getCurrentDate());
			session.update(image);
			User user = image.getUser();
			Integer friendId = image.getUploaderId();
			
			Relationship relat = (Relationship) this.relationshipDAO
								.findByUserAndFriend(user,friendId);
			
			if (relat != null){
				if (relat.levelUp()){
				Message message = new Message(Message.UPGRADE_TYPE, 
												user.getUserId(), this.userDAO.findById(friendId), RestUtil.getCurrentTime() );
					session.save(message);
				}
			
				session.update(relat);
			}
			tx.commit();
//			session.close();
			this.imageDAO.closeSession();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
//			session.close();
			this.imageDAO.closeSession();
			return RestUtil.string2json("false");
		}
	}
	
	@PUT
	@Path("v1/image/{imageId}/unapprove")
	@Produces("application/json;charset=utf-8")
	public Object unapproveImage(@PathParam("imageId") Integer imageId,
			@HeaderParam("token") String token) {
		Image image = new Image();
		image = this.imageDAO.findById(imageId);
		if (image==null ||!image.getUser().getToken().equals(token)){
			return RestUtil.string2json("false");
		}
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
//				session.close();
				this.imageDAO.closeSession();
				return RestUtil.string2json("true");
			}catch (Exception e){
				e.printStackTrace();
//				session.close();
				this.imageDAO.closeSession();
				return RestUtil.string2json("false");
			}
		}	
	}
	
	@PUT
	@Path("v1/image/{imageId}/delete")
	@Produces("application/json;charset=utf-8")
	public Object deleteImage(@PathParam("imageId") Integer imageId,
			@HeaderParam("token") String token) {
		Image image = this.imageDAO.findById(imageId);
		if (image==null ||!image.getUser().getToken().equals(token)){
			return RestUtil.string2json("false");
		}
		if (image.getDeleted()){
			return RestUtil.string2json("true");
		}else{
			Session session = this.imageDAO.getSession();
			try{
				Transaction tx = session.beginTransaction();
				image.setDeleted(true);
				image.setLastModified(RestUtil.getCurrentDate());
				session.update(image);
				
				User user = image.getUser();
				Integer friendId = image.getUploaderId();
				
				Relationship relat = (Relationship) this.relationshipDAO
									.findByUserAndFriend(user,friendId);
				if (relat != null ){
					relat.levelDown();
					session.update(relat);
				}
				
				tx.commit();
//				session.close();
				this.imageDAO.closeSession();
				return RestUtil.string2json("true");
			}catch (Exception e){
				e.printStackTrace();
//				session.close();
				this.imageDAO.closeSession();
				return RestUtil.string2json("false");
			}
		}
	}
	
	@PUT
	@Path("v1/image/{imageId}/restore")
	@Produces("application/json;charset=utf-8")
	public Object restoreImage(@PathParam("imageId") Integer imageId,
			@HeaderParam("token") String token) {
		Image image = new Image();
		image = this.imageDAO.findById(imageId);
		if (image==null || !image.getUser().getToken().equals(token)){
			return RestUtil.string2json("false");
		}
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
//				session.close();
				this.imageDAO.closeSession();
				return RestUtil.string2json("true");
			}catch (Exception e){
				e.printStackTrace();
//				session.close();
				this.imageDAO.closeSession();
				return RestUtil.string2json("false");
			}
		}
	}
	
}