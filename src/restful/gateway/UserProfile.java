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

import db.mapping.object.Message;
import db.mapping.object.Relationship;
import db.mapping.object.User;
import db.mapping.object.DAO.MessageDAO;
import db.mapping.object.DAO.RelationshipDAO;
import db.mapping.object.DAO.UserDAO;

@Path("userProfile")
public class UserProfile {

	private UserDAO userDAO;
	private RelationshipDAO relationshipDAO;
	private MessageDAO messageDAO;
	
	public UserProfile() {
		userDAO = new UserDAO();
		relationshipDAO = new RelationshipDAO();
		messageDAO = new MessageDAO();
	}
	
	private void saveRelationship(Relationship relationship){
		
	}
	
 	private Criteria getCriteria(){
		return this.relationshipDAO.getSession().createCriteria(Relationship.class);
	}

 	
	@POST
	@Path("v1/friends/add")
	@Produces("application/json;charset=utf-8")
	public Object addFriend(@FormParam("id") Integer id,
			@FormParam("friend_id") Integer friend_id,
			@FormParam("type") Integer type,
			@FormParam("is_invitee") Boolean is_invitee,
			@HeaderParam("token") String token) {
		Session session = this.relationshipDAO.getSession();
		try {
			User user = this.userDAO.findById(id);		
			User friend = this.userDAO.findById(friend_id);
//			
//			if (!user.getToken().equals(token)){
//				List<Message> messages = session.createCriteria(Message.class)
//						.add(Restrictions.eq(MessageDAO.MESSAGE_TYPE, Message.ADDFRIEND_TYPE))
//						.add(Restrictions.eq(MessageDAO.USER_ID, id))
//						.add(Restrictions.eq(MessageDAO.FRIEND, friend))
//						.setMaxResults(1)
//						.list();
//				if (messages.size()==0){
//					return RestUtil.string2json("false");
//				}
//			}
			
			List<Relationship> Friends = this.getCriteria()
															.add(Restrictions.eq(RelationshipDAO.USER, user))
															.add(Restrictions.eq(RelationshipDAO.FRIEND_ID, friend_id))
															.list();
			if (Friends.size() == 0) {
				Relationship relationship = new Relationship(user, friend_id, type, is_invitee);
				
				Transaction tx = session.beginTransaction();
				session.save(relationship);
				tx.commit();
//				session.close();
				this.relationshipDAO.closeSession();
				return RestUtil.string2json("true");
			}
			return RestUtil.string2json("false");
		} catch (Exception e) {
			e.printStackTrace();
//			session.close();
			this.relationshipDAO.closeSession();
			return RestUtil.string2json("false");
		}
	}

	
	@PUT
	@Path("v1/friends/update")
	@Produces("application/json;charset=utf-8")
	public Object updateFriend(@FormParam("id") Integer id,
			@FormParam("friend_id") Integer friend_id,
			@FormParam("type") Integer type,
			@FormParam("is_invitee") Boolean is_invitee,
			@HeaderParam("token") String token) {
		Session session = this.relationshipDAO.getSession();
		try {
			User user = this.userDAO.findById(id);
			if (!user.getToken().equals(token)){
				return RestUtil.string2json("false");
			}
			List<Relationship> Friends = this.getCriteria()
					.add(Restrictions.eq(RelationshipDAO.USER, user))
					.add(Restrictions.eq(RelationshipDAO.FRIEND_ID, friend_id))
					.list();
			
			if (Friends.size() == 1) {
				Transaction tx = session.beginTransaction();
				Relationship relationship = Friends.get(0);
				
				//由于现在此函数只用于降级，过作此判定,防止误用
				if (relationship.getRelationship()<type){
					return RestUtil.string2json("false");
				}
				
				relationship.setIsInvitee(is_invitee);
				relationship.setRelationship(type);
				session.update(relationship);
				tx.commit();
//				session.close();
				this.relationshipDAO.closeSession();
				return RestUtil.string2json("true");	
			}
		} catch (Exception e) {
			e.printStackTrace();
//			session.close();
			this.relationshipDAO.closeSession();
		}

		return RestUtil.string2json("false");

	}

	
	@GET
	@Path("v1/friends/{id}/{friend_id}/check")
	@Produces("application/json;charset=utf-8")
	public Object checkFriends(@PathParam("id") Integer id,@PathParam("friend_id") Integer friend_id
			,@HeaderParam("token") String token) {
		
		try{
			User user = this.userDAO.findById(id);
			if (!user.getToken().equals(token)){
				return RestUtil.string2json("false");
			}
			List<Relationship> Friends = this.getCriteria()
					.add(Restrictions.eq(RelationshipDAO.USER, user))
					.add(Restrictions.eq(RelationshipDAO.FRIEND_ID, friend_id))
					.list();
			
			if (Friends.size() == 1) {
				Relationship Friend = Friends.get(0);
					return RestUtil.object2json(Friend.getRelationship());
			}
		} catch (Exception e){
			e.printStackTrace();
			return RestUtil.string2json("false");
		}
		
		return RestUtil.string2json("-1");
	}

	
	@GET
	@Path("v1/friends/{id}/{friend_id}/delete")
	@Produces("application/json;charset=utf-8")
	public Object deleteFriend(@PathParam("id") Integer id,@PathParam("friend_id") Integer friend_id,
			@HeaderParam("token") String token) {

		
		Session session = this.relationshipDAO.getSession();
		try {
			User user = this.userDAO.findById(id);
//			if (!user.getToken().equals(token)){
//				return RestUtil.string2json("false");
//			}
			List<Relationship> Friends = this.getCriteria()
					.add(Restrictions.eq(RelationshipDAO.USER, user))
					.add(Restrictions.eq(RelationshipDAO.FRIEND_ID, friend_id))
					.list();
			
			if (Friends.size() == 1) {
				Transaction tx = session.beginTransaction();
				Relationship Friend = Friends.get(0);
				Relationship relationship = Friend;
				session.delete(relationship);
				tx.commit();
//				session.close();
				this.relationshipDAO.closeSession();
				return RestUtil.string2json("true");
			}
		} catch (Exception e) {
			e.printStackTrace();
//			session.close();
			this.relationshipDAO.closeSession();
			return RestUtil.string2json("false");
		}

		return RestUtil.string2json("false");

	}

	@GET
	@Path("v1/friends/{id}/{type}")
	@Produces("application/json;charset=utf-8")
	public User[] getFriends(@PathParam("id") Integer id,@PathParam("type") Integer type,
			@HeaderParam("token") String token) {

		try {
			User user = this.userDAO.findById(id);
//			if (!user.getToken().equals(token)){
//				return null;
//			}
			List<Relationship> relationships = this.getCriteria().add(Restrictions.eq(RelationshipDAO.USER, user))
					.list();

			if (relationships.size() > 0) {
				List<User> friend_list = new ArrayList();
				for (Relationship relationship : relationships) {
					if (relationship.getRelationship() == type) {
						Integer friend_id = relationship.getFriendId();
						User friend = (new UserDAO()).findById(friend_id);
						friend_list.add(friend);
					}
				}
				User[] friends = new User[friend_list.size()];
				for (int i = 0; i < friend_list.size(); i++) {
					friends[i] = (User) friend_list.get(i);
				}

				return friends;
			}
			return null;
		} catch (Exception e){
			e.printStackTrace();
			return null;
		}
		
	}


}