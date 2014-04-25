package restful.gateway;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.hibernate.Session;
import org.hibernate.Transaction;

import db.mapping.object.*;

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
	@Produces("application/json;charset=utf-8")	
	public Object addFullComment(
			@FormParam("userId") Integer userId,
			@FormParam("content") String content,
			@FormParam("repliedToId") Integer repliedToId,
			@FormParam("repliedById") Integer repliedById) {
		
			session = this.commentDAO.getSession();
			try{
				Transaction tx = session.beginTransaction();			
				
				this.user = this.userDAO.findById(userId);
				if(this.user != null){
					this.comment.setUser(this.user);
					this.comment.setCommentContent(content);
					this.comment.setRepliedByCommentId(repliedById);
					this.comment.setRepliedToCommentId(repliedToId);
					this.comment.setCreateDate(RestUtil.getCurrentDate());
					session.save(this.comment);
					tx.commit();
				}
				session.close();
			//	return RestUtil.string2json("true");
				return RestUtil.object2json(this.comment.getCommentId());
			}catch (Exception e){
				e.printStackTrace();
				session.close();
			}

			//return RestUtil.string2json("false");		
			return null;
	}
	
	@POST
	@Path("v1/comment/add/simple")
	@Produces("application/json;charset=utf-8")	
	public Object addSimpleComment(
			@FormParam("userId") Integer userId,
			@FormParam("content") String content) {
		
			session = this.commentDAO.getSession();
			try{
				Transaction tx = session.beginTransaction();			
				
				this.user = this.userDAO.findById(userId);
				if(this.user != null){
					this.comment.setUser(this.user);
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
	@Produces("application/json;charset=utf-8")	
	public Object addCommentWithReplyTo(
			@FormParam("userId") Integer userId,
			@FormParam("content") String content,
			@FormParam("repliedToId") Integer repliedToId) {
		
			session = this.commentDAO.getSession();
			try{
				Transaction tx = session.beginTransaction();			
				
				this.user = this.userDAO.findById(userId);
				if(this.user != null){
					this.comment.setUser(this.user);
					this.comment.setCommentContent(content);
					this.comment.setRepliedToCommentId(repliedToId);
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

//			return RestUtil.string2json("false");		
			return null;
	}
	
	@POST
	@Path("v1/comment/add/replyBy")
	@Produces("application/json;charset=utf-8")	
	public Object addCommentWithReplyBy(
			@FormParam("userId") Integer userId,
			@FormParam("content") String content,
			@FormParam("repliedById") Integer repliedById) {
		
			session = this.commentDAO.getSession();
			try{
				Transaction tx = session.beginTransaction();			
				
				this.user = this.userDAO.findById(userId);
				if(this.user != null){
					this.comment.setUser(this.user);
					this.comment.setCommentContent(content);
					this.comment.setRepliedByCommentId(repliedById);
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

//			return RestUtil.string2json("false");	
			return null;
	}
	
	@DELETE
	@Path("v1/comment/{commentId}/delete")
	@Produces("application/json;charset=utf-8")	
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
	
	@GET
	@Path("v1/comment/{commentId}")
	@Produces("application/json;charset=utf-8")	
	public Comment getComment(@PathParam("commentId") Integer commentId) {
		this.comment = this.commentDAO.findById(commentId);
		return this.comment;
	}
	
	@GET
	@Path("v1/comment/{userId}/user")
	@Produces("application/json;charset=utf-8")	
	public Comment[] getCommentByUser(@PathParam("userId") Integer userId) {
		Comment comment[] = null;
		this.user = this.userDAO.findById(userId);
		if(this.user!= null){
			List comments = this.commentDAO.findByProperty(Comment.USER, this.user);
			if(comments.size() > 0){
				comment = new Comment[comments.size()];
				for (int i=0; i<comments.size();i++){
					comment[i] = (Comment) comments.get(i);
				}
			}
		}
		return comment;		
	}
	
	@POST
	@Path("v1/imageComment/add")
	@Produces("application/json;charset=utf-8")
	public Object addImageComment(@FormParam("imageId") Integer imageId,@FormParam("commentId") Integer commentId){
		
		this.image = this.imageDAO.findById(imageId);
		this.comment = this.commentDAO.findById(commentId);
		this.imageComment.setImage(this.image);
		this.imageComment.setComment(this.comment);
		
		session = this.imageCommentDAO.getSession();
		try{
			Transaction tx = session.beginTransaction();
			session.save(this.imageComment);
			tx.commit();
			session.close();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			session.close();
		}
	
		return RestUtil.string2json("false");
	}
	
	@DELETE
	@Path("v1/imageComment/{imageId}/{commentId}/delete")
	@Produces("application/json;charset=utf-8")
	public Object deleteImageComment(@PathParam("imageId") Integer imageId,@PathParam("commentId") Integer commentId){
		
		this.image = this.imageDAO.findById(imageId);
		this.comment = this.commentDAO.findById(commentId);
		
		String property[] = {ImageComment.IMAGE,ImageComment.COMMENT};
		Object value[] = {this.image,this.comment};
		
		List imageComments = this.imageCommentDAO.findByProperties(property, value, ImageComment.TABLE);
		session = this.imageCommentDAO.getSession();
		try{
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
			session.close();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			session.close();
		}
	
		return RestUtil.string2json("false");
	}
	
	@GET
	@Path("v1/imageComment/{imageId}")
	@Produces("application/json;charset=utf-8")
	public ImageComment[] getImageComment(@PathParam("imageId") Integer imageId){
		ImageComment[] imageComment = null;
		this.image = this.imageDAO.findById(imageId);
		
		List imageComments = this.imageCommentDAO.findByProperty(ImageComment.IMAGE, this.image);
		if(imageComments.size()>0){
			imageComment = new ImageComment[imageComments.size()];
			for (int i=0; i<imageComments.size();i++){
				imageComment[i] = (ImageComment) imageComments.get(i);
			}
		}
		return imageComment;
	}

}