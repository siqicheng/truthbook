package restful.gateway;
import java.util.Date;
import java.util.List;

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
		ImageDAO imageDAO = new ImageDAO();
		return imageDAO.getSession().createCriteria(Image.class);
	}
	
//	private void closeSession(){
//		this.imageDAO.closeSession();
//	}
	@GET
	@Path("v1/image/{userid}/latest")
	@Produces("application/json;charset=utf-8")
	public Object getLatestImage(@PathParam("userid") Integer userId,
			@HeaderParam("token") String token){
		try{
			
//			Session session = this.imageDAO.getSession();
//			User user = this.userDAO.findById(userId);
			ImageDAO imageDAO = new ImageDAO();
			UserDAO userDAO = new UserDAO();
			Session session = imageDAO.getSession();
			User user = userDAO.findById(userId);
			
			List<Image> image_list = this.getCriteria().add(Restrictions.eq(ImageDAO.USER, user))
													.addOrder(Order.desc(ImageDAO.LAST_MODIFIED))
													.setMaxResults(1).list();
			if (image_list.size()==0){
				return null;
			}
			Image[] images = new Image[image_list.size()];
			for (int i=0; i< image_list.size(); i++){
				images[i] = image_list.get(i);
			}
			this.imageDAO.closeSession();
			return images;
			
		} catch (Exception e){
			e.printStackTrace();
			this.imageDAO.closeSession();
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

		try{
			Session session = this.imageDAO.getSession();
			User user= this.userDAO.findById(userId);
			Relationship relat = this.relationshipDAO.findByUserAndFriend(user, uploaderId);
			if (relat == null ){
				this.imageDAO.closeSession();
				return RestUtil.string2json("false");
			}			
			Transaction tx = session.beginTransaction();
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
			this.imageDAO.closeSession();
			return RestUtil.string2json("false");
		}
	}
	
	@GET
	@Path("v1/image/{imageId}/id")
	@Produces("application/json;charset=utf-8")
	public Object getImageById(@PathParam("imageId") Integer imageId,
			@HeaderParam("token") String token) {
		try {
			Session session = this.imageDAO.getSession();
			Image image = this.imageDAO.findById(imageId);
			User user = image.getUser();
			
			//判断是否是本人，或与本人是好友
			if (!user.getToken().equals(token)){
				List friend = this.userDAO.findByToken(token);
				if (friend == null){
					this.imageDAO.closeSession();
					return null;
				}
				Relationship relat = this.relationshipDAO.findByUserAndFriend(user, ((User)friend.get(0)).getUserId());
				if (relat == null){
					this.imageDAO.closeSession();
					return null;
				}
			}
			this.imageDAO.closeSession();
			return image;
		} catch (Exception e){
			this.imageDAO.closeSession();
			e.printStackTrace();
			return null;
		}
		
	}
	
	@GET
	@Path("v1/image/{userId}/user")
	@Produces("application/json;charset=utf-8")
	public List<Image> getImagesByUser(@PathParam("userId") Integer userId,
			@HeaderParam("token") String token) {
		
		try{
			
			User user = this.userDAO.findById(userId);
			
			ImageDAO imageDAO = new ImageDAO();
			Session session = imageDAO.getSession();
			Criteria criteria =  session.createCriteria(Image.class);

			List<Image> image_list = criteria
					.add(Restrictions.eq(ImageDAO.USER, user))
					.add(Restrictions.ne(ImageDAO.DELETED, true))
					.list();
			
			imageDAO.closeSession();
			
			Image[] images = new Image[image_list.size()];
			
			for (int i=0; i<image_list.size(); i++){
				images[i] = image_list.get(i);
			}	
			return image_list;
		} catch (Exception e){
			imageDAO.closeSession();
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
			
			
			if (image_list.size() > 0){
				Image[] images = new Image[image_list.size()];
				
				for (int i=0; i<image_list.size(); i++){
					images[i] = image_list.get(i);
				}
				this.imageDAO.closeSession();
				return images;
			}
			return null;		
		} catch (Exception e){
			this.imageDAO.closeSession();
			e.printStackTrace();
			return null;
		}
		
	}
	@GET
	@Path("v1/image/{imageId}/like")
	@Produces("application/json;charset=utf-8")
	public Object likeImage(@PathParam("imageId") Integer imageId){

		try{
			ImageDAO imageDAO = new ImageDAO();
			
			Image image =(Image) imageDAO.findById(imageId);
			imageDAO.closeSession();
			
			if (image.getDeleted()){
				return RestUtil.string2json("false");
			}
			
			Session session = this.imageDAO.getSession();
			Transaction tx = session.beginTransaction();
			image.setLiked(image.getLiked()+1);
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
	
	@GET
	@Path("v1/image/{imageId}/dislike")
	@Produces("application/json;charset=utf-8")
	public Object dislikeImage(@PathParam("imageId") Integer imageId){
	
		try{
			ImageDAO imageDAO = new ImageDAO();
			Image image = imageDAO.findById(imageId);
			imageDAO.closeSession();
			
			if (image.getDeleted()){
				return RestUtil.string2json("false");
			}
			Session session = this.imageDAO.getSession();
			Transaction tx = session.beginTransaction();
			image.setLiked(image.getLiked()-1);
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
	
	@GET
	@Path("v1/image/{imageId}/approve")
	@Produces("application/json;charset=utf-8")
	public Object approveImage(@PathParam("imageId") Integer imageId,
			@HeaderParam("token") String token) {
		
		Session session = this.imageDAO.getSession();
		Image image = this.imageDAO.findById(imageId);
		
		if (image==null ||!image.getUser().getToken().equals(token)){
			this.imageDAO.closeSession();
			return RestUtil.string2json("false");
		}
		if (image.getDeleted()){
			this.imageDAO.closeSession();
			return RestUtil.string2json("false");
		}
		if (image.getApproved()){
			this.imageDAO.closeSession();
			return RestUtil.string2json("true");
		}
		try{
			
			Transaction tx = session.beginTransaction();
			image.setApproved(true);
			image.setLastModified(RestUtil.getCurrentDate());
			session.update(image);
			User user = image.getUser();
			Integer friendId = image.getUploaderId();
	
			//这里出现了session后findByxxx:relationshipDAO 
			Relationship relat = (Relationship) this.relationshipDAO
								.findByUserAndFriend(user,friendId);
			//这里出现了session后findById:userDAO
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
			return RestUtil.object2json(relat.getRelationship());
		}catch (Exception e){
			e.printStackTrace();
			this.imageDAO.closeSession();
			return RestUtil.string2json("false");
		}
	}
	
//	@PUT
//	@Path("v1/image/{imageId}/unapprove")
//	@Produces("application/json;charset=utf-8")
//	public Object unapproveImage(@PathParam("imageId") Integer imageId,
//			@HeaderParam("token") String token) {
////		Image image = new Image();
//		
//		Session session = this.imageDAO.getSession();
//		Image image = this.imageDAO.findById(imageId);
//		if (image==null ||!image.getUser().getToken().equals(token)){
////			this.imageDAO.closeSession();
//			return RestUtil.string2json("false");
//		}
//		if (image.getDeleted()){
////			this.imageDAO.closeSession();
//			return RestUtil.string2json("false");
//		}
//		if (!image.getApproved()){
////			this.imageDAO.closeSession();
//			return RestUtil.string2json("true");
//		}else{
//			try{
//				Transaction tx = session.beginTransaction();
//				image.setApproved(false);
//				image.setLastModified(RestUtil.getCurrentDate());
//				session.update(image);
//				tx.commit();
////				this.imageDAO.closeSession();
//				return RestUtil.string2json("true");
//			}catch (Exception e){
//				e.printStackTrace();
////				this.imageDAO.closeSession();
//				return RestUtil.string2json("false");
//			}
//		}	
//	}
	
	@PUT
	@Path("v1/image/{imageId}/delete")
	@Produces("application/json;charset=utf-8")
	public Object deleteImage(@PathParam("imageId") Integer imageId,
			@HeaderParam("token") String token) {
		
		Session session = this.imageDAO.getSession();
		Image image = this.imageDAO.findById(imageId);
		if (image==null ||!image.getUser().getToken().equals(token)){
			this.imageDAO.closeSession();
			return RestUtil.string2json("false");
		}
		if (image.getDeleted()){
			this.imageDAO.closeSession();
			return RestUtil.string2json("true");
		}else{		
			try{
				Transaction tx = session.beginTransaction();
				image.setDeleted(true);
				image.setLastModified(RestUtil.getCurrentDate());
				session.update(image);
				
				User user = image.getUser();
				Integer friendId = image.getUploaderId();

				//这里出现了session后findByxxx:relationshipDAO 
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
	
//	@PUT
//	@Path("v1/image/{imageId}/restore")
//	@Produces("application/json;charset=utf-8")
//	public Object restoreImage(@PathParam("imageId") Integer imageId,
//			@HeaderParam("token") String token) {
////		Image image = new Image();
//		Session session = this.imageDAO.getSession();
//		Image image = this.imageDAO.findById(imageId);
//		if (image==null || !image.getUser().getToken().equals(token)){
////			this.imageDAO.closeSession();
//			return RestUtil.string2json("false");
//		}
//		if (!image.getDeleted()){
////			this.imageDAO.closeSession();
//			return RestUtil.string2json("true");
//		}else{
//			try{
//				Transaction tx = session.beginTransaction();
//				image.setDeleted(false);
//				image.setLastModified(RestUtil.getCurrentDate());
//				session.update(image);
//				tx.commit();
////				this.imageDAO.closeSession();
//				return RestUtil.string2json("true");
//			}catch (Exception e){
//				e.printStackTrace();
////				this.imageDAO.closeSession();
//				return RestUtil.string2json("false");
//			}
//		}
//	}
	
}