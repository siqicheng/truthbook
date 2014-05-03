package restful.gateway;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

import db.mapping.object.*;
import db.mapping.object.DAO.CommentDAO;
import db.mapping.object.DAO.ImageCommentDAO;
import db.mapping.object.DAO.ImageDAO;
import db.mapping.object.DAO.UserDAO;

import antySamy.AntySamyFilter;;

@Path("commentService")
public class CommentService {
	
	private Comment comment;
	private CommentDAO commentDAO;
	private User user;
	private UserDAO userDAO;
	private Image image;
	private ImageDAO imageDAO;
	private ImageComment imageComment;
	private ImageCommentDAO imageCommentDAO;
	
	private Session session;
	
	public CommentService(){
		comment = new Comment();
		commentDAO = new CommentDAO();
		user = new User();
		userDAO = new UserDAO();
		image = new Image();
		imageDAO = new ImageDAO();
		imageComment = new ImageComment();
		imageCommentDAO = new ImageCommentDAO();
	}

	@POST
	@Path("v1/comment/add/full")
	@Produces("application/json")	
	public Object addFullComment(
			@FormParam("userId") Integer userId,
			@FormParam("content") String content,
			@FormParam("repliedToId") Integer repliedToId,
			@FormParam("repliedById") Integer repliedById,
			@HeaderParam("token") String token) {
		
			session = this.commentDAO.getSession();
			try{
				Transaction tx = session.beginTransaction();			
				
				this.user = this.userDAO.findById(userId);
				User sender = this.userDAO.findById(repliedById);
				if (sender==null || !sender.getToken().equals(token)){
					return null;
				}
				if(this.user != null){
					this.comment.setUser(this.user);
					content = AntySamyFilter.getCleanHtml(content);
					this.comment.setCommentContent(content);
					this.comment.setRepliedByCommentId(repliedById);
					this.comment.setRepliedToCommentId(repliedToId);
					this.comment.setCreateDate(RestUtil.getCurrentDate());
					session.save(this.comment);
					tx.commit();
				}
//				session.close();
				this.commentDAO.closeSession();
				return RestUtil.object2json(this.comment.getCommentId());
			}catch (Exception e){
				e.printStackTrace();
//				session.close();
				this.commentDAO.closeSession();
				return null;
			}
	}
	
	@POST
	@Path("v1/comment/add/replyBy")
	@Produces("application/json")	
	public Object addCommentWithReplyBy(
			@FormParam("userId") Integer userId,
			@FormParam("content") String content,
			@FormParam("repliedById") Integer repliedById,
			@HeaderParam("token") String token) {
		
			session = this.commentDAO.getSession();
			try{
				Transaction tx = session.beginTransaction();			
				User sender = this.userDAO.findById(repliedById);
				if (!sender.getToken().equals(token)){
					return null;
				}
				this.user = this.userDAO.findById(userId);
				if(this.user != null){
					this.comment.setUser(this.user);
					content = AntySamyFilter.getCleanHtml(content);
					this.comment.setCommentContent(content);
					this.comment.setRepliedByCommentId(repliedById);
					this.comment.setCreateDate(RestUtil.getCurrentDate());
					session.save(this.comment);
					tx.commit();
				}
//				session.close();
				this.commentDAO.closeSession();
				return RestUtil.object2json(this.comment.getCommentId());
			}catch (Exception e){
				e.printStackTrace();
//				session.close();
				this.commentDAO.closeSession();
			}
			return null;
	}
	
	
	@POST
	@Path("v1/imageComment/add")
	@Produces("application/json")
	public Object addImageComment(@FormParam("imageId") Integer imageId,
			@FormParam("commentId") Integer commentId,
			@HeaderParam("token") String token){
		
		
		try{
			this.image = this.imageDAO.findById(imageId);
			this.comment = this.commentDAO.findById(commentId);
			
			User sender = this.userDAO.findById(this.comment.getRepliedByCommentId());
			if (!sender.getToken().equals(token)){
				return RestUtil.string2json("false");
			}
			
			this.imageComment.setImage(this.image);
			this.imageComment.setComment(this.comment);
			
			session = this.imageCommentDAO.getSession();
			
			Transaction tx = session.beginTransaction();
			session.save(this.imageComment);
			tx.commit();
//			session.close();
			this.commentDAO.closeSession();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			if (session.isConnected()) {
//				session.close();
				this.commentDAO.closeSession();	
			}
		}
		return RestUtil.string2json("false");
	}
	
	@GET
	@Path("v1/imageComment/{imageId}")
	@Produces("application/json")
	public ImageComment[] getImageComment(@PathParam("imageId") Integer imageId,
			@HeaderParam("token") String token){
		ImageComment[] imageComment = null;
		try{
			this.image = this.imageDAO.findById(imageId);
	//		if (!this.image.getUser().getToken().equals(token)){
	//			return null;
	//		}
			Session session = this.imageCommentDAO.getSession();
			Criteria criteria = session.createCriteria(ImageComment.class);
			
	//		List imageComments = this.imageCommentDAO.findByProperty(ImageCommentDAO.IMAGE, this.image);
			List imageComments = criteria.add(Restrictions.eq(ImageCommentDAO.IMAGE, image)).list();
			if(imageComments.size()>0){
				imageComment = new ImageComment[imageComments.size()];
				for (int i=0; i<imageComments.size();i++){
					imageComment[i] = (ImageComment) imageComments.get(i);
				}
			}
			this.imageCommentDAO.closeSession();
			return imageComment;
		} catch (Exception e){
			e.printStackTrace();
			this.imageCommentDAO.closeSession();
			return null;
		}
	}
	
	@DELETE
	@Path("v1/imageComment/{imageId}/{commentId}/delete")
	@Produces("application/json")
	public Object deleteImageComment(@PathParam("imageId") Integer imageId,
			@PathParam("commentId") Integer commentId,
			@HeaderParam("token") String token){
		
		try{
			this.image = this.imageDAO.findById(imageId);
//			if (!this.image.getUser().getToken().equals(token)){
//				return RestUtil.string2json("false");
//			}
			this.comment = this.commentDAO.findById(commentId);
			
			String property[] = {ImageCommentDAO.IMAGE,ImageCommentDAO.COMMENT};
			Object value[] = {this.image,this.comment};
			
			List imageComments = this.imageCommentDAO.findByProperties(property, value, ImageCommentDAO.TABLE);
			Session session = this.imageCommentDAO.getSession();
			if(imageComments.size()>0){
				Transaction tx = session.beginTransaction();
				for(int i=0; i<imageComments.size();i++){
					this.imageComment = (ImageComment)imageComments.get(i);
					if(this.imageComment!=null){
						session.delete(this.imageComment);
					}
				}
				tx.commit();				
			}
//			session.close();
			this.imageCommentDAO.closeSession();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
//			session.close();
			this.imageCommentDAO.closeSession();
		}
	
		return RestUtil.string2json("false");
	}
	
	
	@GET
	@Path("v1/imageComment/{imageId}/{commentNumber}")
	@Produces("application/json")
	public ImageComment[] getLatestImageComment(@PathParam("imageId") Integer imageId,
			@PathParam("commentNumber") Integer commentNumber,
			@HeaderParam("token") String token){
		
		try{
			ImageComment[] imageComment = null;
			this.image = this.imageDAO.findById(imageId);
//			if (!this.image.getUser().getToken().equals(token)){
//				return null;
//			}
			Session session = this.imageDAO.getSession();
			Criteria criteria = session.createCriteria(ImageComment.class);
			criteria.addOrder(Order.desc(ImageCommentDAO.ID))
					.add(Restrictions.eq("image",image))
					.setMaxResults(commentNumber);
			
			List<ImageComment> icl = criteria.list();
			
			imageComment = new ImageComment[icl.size()];
			
			for (int i=0; i<icl.size(); i++){
				imageComment[i] = icl.get(i);
			}
			this.imageDAO.closeSession();
			return imageComment;
		} catch (Exception e){
			e.printStackTrace();
			this.imageDAO.closeSession();
			return null;
		}
		
	}
	
/*	

	@POST
	@Path("v1/comment/add/simple")
	@Produces("application/json")	
	public Object addSimpleComment(
			@FormParam("userId") Integer userId,
			@FormParam("content") String content,
			@HeaderParam("token") String token) {
		
			session = this.commentDAO.getSession();
			try{
				Transaction tx = session.beginTransaction();			
				this.user = this.userDAO.findById(userId);
				if(this.user != null){
					this.comment.setUser(this.user);
					content = AntySamyFilter.getCleanHtml(content);
					this.comment.setCommentContent(content);
					this.comment.setCreateDate(RestUtil.getCurrentDate());
					session.save(this.comment);
					tx.commit();
				}
				session.close();
//				return RestUtil.string2json("true");
				return RestUtil.object2json(this.comment.getCommentId());
			}catch (Exception e){
				e.printStackTrace();
				session.close();
			}

			//return RestUtil.string2json("false");		
			return null;
	}
	
	@POST
	@Path("v1/comment/add/replyTo")
	@Produces("application/json")	
	public Object addCommentWithReplyTo(
			@FormParam("userId") Integer userId,
			@FormParam("content") String content,
			@FormParam("repliedToId") Integer repliedToId,
			@FormParam("token") String token) {
		
			session = this.commentDAO.getSession();
			try{
				Transaction tx = session.beginTransaction();			
				this.user = this.userDAO.findById(userId);
				if(this.user != null){
					this.comment.setUser(this.user);
					content = AntySamyFilter.getCleanHtml(content);
					this.comment.setCommentContent(content);
					this.comment.setRepliedToCommentId(repliedToId);
					this.comment.setCreateDate(RestUtil.getCurrentDate());
					session.save(this.comment);
					tx.commit();
				}
				session.close();
				return RestUtil.object2json(this.comment.getCommentId());
			}catch (Exception e){
				e.printStackTrace();
				session.close();
			}

			return null;
	}

	
	@DELETE
	@Path("v1/comment/{commentId}/delete")
	@Produces("application/json")	
	public Object deleteComment(@PathParam("commentId") Integer commentId) {
		
		session = this.commentDAO.getSession();
		try{
			Transaction tx = session.beginTransaction();			
			this.comment = this.commentDAO.findById(commentId);
			if(this.comment != null){
				session.delete(this.comment);
				tx.commit();
			}
			session.close();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			session.close();
		}

		return RestUtil.string2json("false");		
	}
/*	
	@GET
	@Path("v1/comment/{commentId}")
	@Produces("application/json")	
	public Comment getComment(@PathParam("commentId") Integer commentId) {
		this.comment = this.commentDAO.findById(commentId);
		return this.comment;
	}
	
	
	@GET
	@Path("v1/comment/{userId}/user")
	@Produces("application/json")	
	public Comment[] getCommentByUser(@PathParam("userId") Integer userId) {
		Comment comment[] = null;
		this.user = this.userDAO.findById(userId);
		if(this.user!= null){
			List comments = this.commentDAO.findByProperty(CommentDAO.USER, this.user);
			if(comments.size() > 0){
				comment = new Comment[comments.size()];
				for (int i=0; i<comments.size();i++){
					comment[i] = (Comment) comments.get(i);
				}
			}
		}
		return comment;		
	}
*/
	
	
	
	
	

	
	
	
}