package restful.gateway;

import java.util.ArrayList;
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
import org.hibernate.criterion.Restrictions;

import db.mapping.object.Image;
import db.mapping.object.Message;
import db.mapping.object.User;
import db.mapping.object.DAO.ImageDAO;
import db.mapping.object.DAO.MessageDAO;
import db.mapping.object.DAO.UserDAO;

@Path("notification")
public class MsgService {
	private MessageDAO messageDAO;
	private ImageDAO imageDAO;
	private UserDAO userDAO;
	
	public MsgService(){
		this.messageDAO = new MessageDAO();
		this.imageDAO = new ImageDAO();
		this.userDAO = new UserDAO();
	}

	private Criteria getCriteria(){
		return this.messageDAO.getSession().createCriteria(Message.class);
	}
	
	private  void saveMessage(Message message){
		Session session = this.messageDAO.getSession();
		try{
			Transaction tx = session.beginTransaction();
			session.save(message);
			tx.commit();
		} catch (Exception e){
			e.printStackTrace();
		}  finally {
//			session.close();
			this.messageDAO.closeSession();
		}
	}
	
	private boolean existDuplicated(Integer userId, String type, Image image){
		List<Message> message_list = this.getCriteria().add(Restrictions.eq(MessageDAO.USER_ID, userId))
															.add(Restrictions.eq(MessageDAO.MESSAGE_TYPE, type))
															.add(Restrictions.eq(MessageDAO.IMAGE, image))
															.add(Restrictions.ne(MessageDAO.STATUS, Message.READ_STATUS))
															.list();
		return (message_list.size() > 0);
	}

	private Message[] setStatus(List<Message> messages, String status){
		if (messages.size()==0){
			return null;
		}
		Session session = this.messageDAO.getSession();
		try{
			Message[] ret_messages =  new Message[messages.size()];
			Transaction tx = session.beginTransaction();
			for (int i=0; i<messages.size(); ++i){
				Message message = messages.get(i);
				message.setStatus(status);
				session.update(message);
				ret_messages[i] = message;
			}
			tx.commit();
			this.messageDAO.closeSession();
			return ret_messages;
		} catch (Exception e){
			e.printStackTrace();
//			session.close();
			this.messageDAO.closeSession();
			return null;
		}
	}
	
	private Message[] setSent(List<Message> messages){
		return this.setStatus(messages, Message.SENT_STATUS);
	}
	
	private void setRead(List<Message> messages){
		if (messages.size()==0){
			return ;
		}
		Session session = this.messageDAO.getSession();
		try{
			Transaction tx = session.beginTransaction();
			for (int i=0; i<messages.size(); ++i){
				Message message = messages.get(i);
				message.setStatus(Message.READ_STATUS);
				message.setReadTime(RestUtil.getCurrentTime());
				session.update(message);
			}
			tx.commit();
			this.messageDAO.closeSession();
		} catch (Exception e){
			e.printStackTrace();
//			session.close();
			this.messageDAO.closeSession();
		}
	}
	
	
	@PUT
	@Path("v1/message/{id}/{srcid}/{type}/send")
	@Produces("application/json;charset=utf-8")
	public Object sendMesssage(@PathParam("id") Integer id,
			@PathParam("srcid") Integer srcid, 
			@PathParam("type") String type,
			@HeaderParam("token") String token) {
		if (id==srcid){
			return RestUtil.string2json("false");
		}
		try{
			User user = this.userDAO.findById(srcid);
			if (!user.getToken().equals(token)){
				return RestUtil.string2json("false");
			}
			this.saveMessage(new Message(type, id, this.userDAO.findById(srcid), RestUtil.getCurrentTime()));
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			return RestUtil.string2json("false");
		}	
	}
	
	@PUT
	@Path("v1/message/{id}/{srcid}/{type}/{imageid}/send")
	@Produces("application/json;charset=utf-8")
	public Object sendImageMesssage(@PathParam("id") Integer id,
			@PathParam("srcid") Integer srcid, 
			@PathParam("type") String type,
			@PathParam("imageid") Integer imageid,
			@HeaderParam("token") String token){
		
		if (id==srcid){
			return RestUtil.string2json("false");
		}
		try{
			User user = this.userDAO.findById(srcid);
			if (!user.getToken().equals(token)){
				return RestUtil.string2json("false");
			}
			Image image= this.imageDAO.findById(imageid);
			if (type.equals(Message.REPLY_TYPE) && this.existDuplicated(id, Message.REPLY_TYPE, image) ) {
				return RestUtil.string2json("true");
			}
			this.saveMessage(new Message(type, id, this.userDAO.findById(srcid),  RestUtil.getCurrentTime(), image));
			return RestUtil.string2json("true");
			
		}catch (Exception e){
			e.printStackTrace();
			return RestUtil.string2json("false");
		}	
	}
	
	
	
	@POST
	@Path("v1/message/imageContent/send")
	@Produces("application/json;charset=utf-8")
	public Object sendImageContentMesssage(@FormParam("id") Integer id,
			@FormParam("srcid") Integer srcid, 
			@FormParam("type") String type,
			@FormParam("content") String content,
			@FormParam("imageId") Integer imageId,
			@HeaderParam("token") String token) throws Exception {
		
		if (id==srcid){
			return RestUtil.string2json("false");
		}
		try{
			User user = this.userDAO.findById(srcid);
			if (!user.getToken().equals(token)){
				return RestUtil.string2json("false");
			}
			Image image= this.imageDAO.findById(imageId);
			if (type.equals(Message.REPLY_TYPE) && this.existDuplicated(id, Message.REPLY_TYPE, image)){
				return RestUtil.string2json("true");
			}
			this.saveMessage(new Message(type, id, this.userDAO.findById(srcid),  RestUtil.getCurrentTime(), image, content));
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			return RestUtil.string2json("false");
		}	
	}
	
	@POST
	@Path("v1/message/content/send")
	@Produces("application/json;charset=utf-8")
	public Object sendContentMesssage(@FormParam("id") Integer id,
			@FormParam("srcid") Integer srcid, 
			@FormParam("type") String type,
			@FormParam("content") String content,
			@HeaderParam("token") String token) throws Exception {
		
		if (id==srcid){
			return RestUtil.string2json("false");
		}
		try{
			User user = this.userDAO.findById(srcid);
			if (!user.getToken().equals(token)){
				return RestUtil.string2json("false");
			}
			this.saveMessage(new Message(type, id, this.userDAO.findById(srcid),  RestUtil.getCurrentTime(), content) );
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			return RestUtil.string2json("false");
		}	
	}

	@GET
	@Path("v1/message/{userid}/getunsent")
	@Produces("application/json;charset=utf-8")
	public Object getUnsentMessage(@PathParam("userid") Integer id,
			@HeaderParam("token") String token) {
		try{
			User user = this.userDAO.findById(id);
			if (user == null || !user.getToken().equals(token)){
				return null;
			}
			List<Message> Messages= this.getCriteria()
					.add(Restrictions.eq(MessageDAO.USER_ID, id)).
					add(Restrictions.eq(MessageDAO.STATUS, Message.UNSENT_STATUS)).
					list() ;
			this.messageDAO.closeSession();
			return this.setSent(Messages);
		}catch (Exception e){
			e.printStackTrace();
			this.messageDAO.closeSession();
			return null;
		}
	}
	
	@GET
	@Path("v1/message/{userid}/{type}/get")
	@Produces("application/json;charset=utf-8")
	public Object getMessage(@PathParam("userid") Integer id,
			@PathParam("type") String type,
			@HeaderParam("token") String token) throws Exception {
		try{
			User user = this.userDAO.findById(id);
			if (!user.getToken().equals(token)){
				return null;
			}
			List<Message> Messages=this.getCriteria().add(Restrictions.eq(MessageDAO.USER_ID, id))
					.add(Restrictions.eq(MessageDAO.MESSAGE_TYPE, type))
					.add(Restrictions.ne(MessageDAO.STATUS, Message.READ_STATUS))
					.list();
			return this.setSent(Messages);
		}catch (Exception e){
			e.printStackTrace();
			return null;
		}
	}

	@GET
	@Path("v1/message/{userid}/get")
	@Produces("application/json;charset=utf-8")
	public Object getMessage(@PathParam("userid") Integer id,
			@HeaderParam("token") String token) {
		
		try{
			User user = this.userDAO.findById(id);
			if (!user.getToken().equals(token)){
				return null;
			}
			List<Message> Messages=this.getCriteria().add(Restrictions.eq(MessageDAO.USER_ID, id))
					.add(Restrictions.ne(MessageDAO.STATUS, Message.READ_STATUS))
					.list();
			return this.setSent(Messages);
		}catch (Exception e){
			e.printStackTrace();
			return null;
		}
	}
	
	@GET
	@Path("v1/message/{messageid}/read")
	@Produces("application/json;charset=utf-8")
	public Object readMessage(@PathParam("messageid") Integer id,
			@HeaderParam("token") String token){
		try{
			Message message = this.messageDAO.findById(id);
			User user = this.userDAO.findById(message.getUserId());
			if (!user.getToken().equals(token)){
				return RestUtil.string2json("false");
			}
			if (message.getStatus().equals(Message.SENT_STATUS)){
				List<Message> msg = new ArrayList<Message>();
				msg.add(message);
				this.setRead(msg);
			}
			
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			return RestUtil.string2json("false");
		}
	}

	@GET
	@Path("v1/message/{userid}/{type}/read")
	@Produces("application/json;charset=utf-8")
	public Object readSentMessage(@PathParam("userid") Integer id ,
			@PathParam("type")String type,
			@HeaderParam("token") String token){
		try{
			User user = this.userDAO.findById(id);
			if (!user.getToken().equals(token)){
				return RestUtil.string2json("false");
			}
			
			List<Message> Messages=this.getCriteria().add(Restrictions.eq(MessageDAO.USER_ID, id))
					.add(Restrictions.eq(MessageDAO.STATUS, Message.SENT_STATUS))
					.add(Restrictions.eq(MessageDAO.MESSAGE_TYPE, type))
					.list();
			this.setRead(Messages);
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			return RestUtil.string2json("false");
		}
	}
}
