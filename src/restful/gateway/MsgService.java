package restful.gateway;

import org.hibernate.Session;
import org.hibernate.SessionFactory;

import javax.ws.rs.PUT;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import java.sql.Timestamp;
import org.hibernate.Transaction;
import db.mapping.object.User;
import db.mapping.object.UserDAO;
import db.mapping.object.Message;
import db.mapping.object.ReadMessage;
import db.mapping.object.ReadMessageDAO;
import db.mapping.object.MessageDAO;

import java.util.ArrayList;
import java.util.List;

@Path("notification")
public class MsgService {
	private MessageDAO messageDAO;
	private ReadMessageDAO readMessageDAO;
	private static final String messageTypes[]={"friendAdd","friendLevelUp","imageUpload","invitedToUpload","quoteConfirm","imageAccepted"};
	public MsgService(){
		this.messageDAO = new MessageDAO();
		this.readMessageDAO = new ReadMessageDAO();
	}
	
	private static boolean assertType(String Type)throws Exception{
		
		try{
			for (String t: MsgService.messageTypes) {
				if (t.equals(Type)){
					return true;
				}
			}
			
			StringBuffer tmp = new StringBuffer();
			tmp.append( "Message type must be one of the listed:\n");
			for (String s : MsgService.messageTypes){
				tmp.append(s+"\n");
			}
			throw new Exception(tmp.toString());
			
		} catch (Exception e){
			e.printStackTrace();
			return false;
		}
	}

	@GET
	@Path("v1/message/{id}/{srcid}/{type}/send")
	@Produces("application/json")
	public Object sendMesssage(@PathParam("id") Integer id,
			@PathParam("srcid") Integer srcid, 
			@PathParam("type") String type) throws Exception {
		
		if  (!MsgService.assertType(type)) {
			return RestUtil.string2json("false");
		}
		
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
	@Produces("application/json;charset=utf-8")
	public Object getMessage(@PathParam("userid") Integer id,
			@PathParam("type") String type) throws Exception {
		
		if  (!MsgService.assertType(type)) {
			return false;
		}
		
		
		String property[] = {MessageDAO.USER_ID, MessageDAO.MESSAGE_TYPE};
		Object value[] = {id,type};	
		
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
			return null;
		}catch (Exception e){
			e.printStackTrace();
			return null;
		}
	}

	@GET
	@Path("v1/message/{userid}/get")
	@Produces("application/json;charset=utf-8")
	public Object getMessage(@PathParam("userid") Integer id) {
		
		try{
			List Messages=this.messageDAO.findByUserId(id);
			
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
			return null;
		}catch (Exception e){
			e.printStackTrace();
			return null;
		}
	}
	
	@PUT
	@Path("v1/message/{messageid}/read")
	@Produces("application/json;charset=utf-8")
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
			session.close();
			return RestUtil.string2json("true");
		}catch (Exception e){
			e.printStackTrace();
			session.close();
			return RestUtil.string2json("false");
		}
	}
	
}
