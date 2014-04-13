package restful.gateway;

import org.hibernate.Session;

import javax.ws.rs.PUT;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;

import java.sql.Timestamp;
import org.hibernate.Transaction;
import db.mapping.object.User;
import db.mapping.object.UserDAO;
import db.mapping.object.Message;
import db.mapping.object.ReadMessage;
import db.mapping.object.ReadMessageDAO;
import db.mapping.object.MessageDAO;
import db.mapping.object.Relationship;

import java.util.ArrayList;
import java.util.List;

@Path("push")
public class MsgService {
	private MessageDAO messageDAO;
	private MessageDAO readMessageDAO;
	
	public MsgService(){
		this.messageDAO = new MessageDAO();
	}

	@GET
	@Path("v1/message/{id}/{srcid}/{type}/send")
	@Produces("application/json")
	public Object sendMesssage(@PathParam("id") Integer id,
			@PathParam("srcid") Integer srcid, 
			@PathParam("type") String type) {
		Session session=this.messageDAO.getSession();
		try{
			User src = (new UserDAO()).findById(srcid);
			
			Message newinstance = new Message(type, id, src,
					new Timestamp(System.currentTimeMillis()));
			
			Transaction tx=session.beginTransaction();
			session.save(newinstance);
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
	@Path("v1/message/{userid}/{type}/get")
	@Produces("application/json")
	public Object getMessage(@PathParam("userid") Integer id,
			@PathParam("type") String type) {
		
		String property[] = {MessageDAO.USER_ID, MessageDAO.MESSAGE_TYPE};
		Object value[] = {id,type};	
		
		Session session=this.messageDAO.getSession();
		try{
			List Messages=this.messageDAO.findByProperties(property, value, MessageDAO.TABLE);
			
			if (Messages.size()>0){
				List message_list = new ArrayList();
				
				for (Object message : Messages){
					if (message instanceof Message){
						message_list.add(message);
					}
				}
				
				Message[] messages = new Message[message_list.size()];
				for (int i=0; i<message_list.size();i++){
					messages[i] = (Message) message_list.get(i);
				}
				return messages;
			}
			session.close();
			return null;
		}catch (Exception e){
			e.printStackTrace();
			session.close();
			return null;
		}
	}
	
	@GET
	@Path("v1/message/{messageid}/read")
	@Produces("application/json")
	public Object readMessage(@PathParam("messageid") Integer id){
		Session session = this.messageDAO.getSession();
		try{
			Message message = this.messageDAO.findById(id);
			ReadMessage readmsg = new ReadMessage(message);
			readmsg.setReadTime(new Timestamp(System.currentTimeMillis() ));
			
			Transaction tx = session.beginTransaction();
			session.delete(message);
			session.save(readmsg);
			
			tx.commit();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			session.close();
			return RestUtil.string2json("false");
		}
	}
	
}
