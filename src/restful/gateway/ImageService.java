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
import org.hibernate.criterion.Order;
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
	
	private Criteria getCriteria(){
		return this.imageDAO.getSession().createCriteria(Image.class);
	}
	
	private void closeSession(){
		this.imageDAO.closeSession();
	}
	
	@GET
	@Path("v1/image/{userid}/latest")
	@Produces("application/json;charset=utf-8")
	public Object getLatestImage(@PathParam("userid") Integer userId,
			@HeaderParam("token") String token){
//		if (!user.getToken().equals(token)){
//			return null;
//		}
		try{
			User user = new UserDAO().findById(userId);
			List<Image> image_list = this.getCriteria().add(Restrictions.eq(ImageDAO.USER, user))
													.addOrder(Order.desc(ImageDAO.LAST_MODIFIED))
													.setMaxResults(1).list();
			this.closeSession();
			if (image_list.size()>0){
				return null;
			}
			Image[] images = new Image[image_list.size()];
			for (int i=0; i< image_list.size(); i++){
				images[i] = image_list.get(i);
			}
			return images;
			
		} catch (Exception e){
			e.printStackTrace();
			this.closeSession();
			return null;
		}
		
		
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
			User user= this.userDAO.findById(userId);
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
			this.closeSession();
			return image;
		} catch (Exception e){
			this.closeSession();
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
			
			Criteria criteria = this.getCriteria();
			List<Image> image_list = criteria
					.add(Restrictions.eq(ImageDAO.USER, user))
					.add(Restrictions.ne(ImageDAO.DELETED, true))
					.list();
			Image[] images = new Image[image_list.size()];
			
			for (int i=0; i<image_list.size(); i++){
				images[i] = image_list.get(i);
			}
			
			this.closeSession();
			return images;
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
			
			Criteria criteria = this.getCriteria();
			List<Image> image_list = criteria.add(Restrictions.eq(ImageDAO.UPLOADER_ID, uploaderId))
											.add(Restrictions.eq(ImageDAO.DELETED, false))
											.add(Restrictions.eq(ImageDAO.APPROVED, true))
											.list();
			
			this.closeSession();
			if (image_list.size() > 0){
				Image[] images = new Image[image_list.size()];
				
				for (int i=0; i<image_list.size(); i++){
					images[i] = image_list.get(i);
				}
				
				return images;
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
			this.closeSession();
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
			this.closeSession();
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
			this.imageDAO.closeSession();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
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
				this.imageDAO.closeSession();
				return RestUtil.string2json("true");
			}catch (Exception e){
				e.printStackTrace();
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
				this.imageDAO.closeSession();
				return RestUtil.string2json("true");
			}catch (Exception e){
				e.printStackTrace();
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
				this.imageDAO.closeSession();
				return RestUtil.string2json("true");
			}catch (Exception e){
				e.printStackTrace();
				this.imageDAO.closeSession();
				return RestUtil.string2json("false");
			}
		}
	}
	
}