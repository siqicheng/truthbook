package restful.gateway;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

import db.mapping.object.Relationship;
import db.mapping.object.User;
import db.mapping.object.DAO.RelationshipDAO;
import db.mapping.object.DAO.UserDAO;

@Path("userProfile")
public class UserProfile {

	private UserDAO userDAO;
	private RelationshipDAO relationshipDAO;

	public UserProfile() {
		userDAO = new UserDAO();
		relationshipDAO = new RelationshipDAO();
	}
	
	private void saveRelationship(Relationship relationship){
		Session session = this.relationshipDAO.getSession();
		try{
			Transaction tx = session.beginTransaction();
			session.save(relationship);
			tx.commit();
			session.close();
		} catch (Exception e){
			e.printStackTrace();
			session.close();
		}
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
			@FormParam("is_invitee") Boolean is_invitee) {
		User user = this.userDAO.findById(id);		
		try {
			List<Relationship> Friends = this.getCriteria()
															.add(Restrictions.eq(RelationshipDAO.USER, user))
															.add(Restrictions.eq(RelationshipDAO.FRIEND_ID, friend_id))
															.list();
			if (Friends.size() == 0) {
				this.saveRelationship(new Relationship(user, friend_id, type, is_invitee));
				return RestUtil.string2json("true");
			}
			return RestUtil.string2json("false");
		} catch (Exception e) {
			e.printStackTrace();
			return RestUtil.string2json("false");
		}
	}

	
	@PUT
	@Path("v1/friends/update")
	@Produces("application/json;charset=utf-8")
	public Object updateFriend(@FormParam("id") Integer id,
			@FormParam("friend_id") Integer friend_id,
			@FormParam("type") Integer type,
			@FormParam("is_invitee") Boolean is_invitee) {

		User user = this.userDAO.findById(id);
		Session session = this.relationshipDAO.getSession();
		try {
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
				session.close();
				return RestUtil.string2json("true");	
			}
		} catch (Exception e) {
			e.printStackTrace();
			session.close();
		}

		return RestUtil.string2json("false");

	}

	
	@GET
	@Path("v1/friends/{id}/{friend_id}/check")
	@Produces("application/json;charset=utf-8")
	public Object checkFriends(@PathParam("id") Integer id,@PathParam("friend_id") Integer friend_id) {
		User user = this.userDAO.findById(id);

		String property[] = { RelationshipDAO.USER, RelationshipDAO.FRIEND_ID };
		Object value[] = { user, friend_id };

		List Friends = this.relationshipDAO.findByProperties(property, value,
				RelationshipDAO.TABLE);
		if (Friends.size() == 1) {
			Object Friend = Friends.get(0);
			if (Friend instanceof Relationship) {
				return RestUtil.object2json(((Relationship) Friend)
						.getRelationship());
			}
		}
		return RestUtil.string2json("-1");
	}

	
	@GET
	@Path("v1/friends/{id}/{friend_id}/delete")
	@Produces("application/json;charset=utf-8")
	public Object deleteFriend(@PathParam("id") Integer id,@PathParam("friend_id") Integer friend_id) {

		User user = this.userDAO.findById(id);

		String property[] = { RelationshipDAO.USER, RelationshipDAO.FRIEND_ID };
		Object value[] = { user, friend_id };

		Session session = this.relationshipDAO.getSession();
		try {
			List Friends = this.relationshipDAO.findByProperties(property,
					value, RelationshipDAO.TABLE);
			if (Friends.size() == 1) {
				Transaction tx = session.beginTransaction();
				Object Friend = Friends.get(0);
				if (Friend instanceof Relationship) {
					Relationship relationship = (Relationship) Friend;
					session.delete(relationship);
					tx.commit();
					session.close();
					return RestUtil.string2json("true");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			session.close();
			return RestUtil.string2json("false");
		}

		return RestUtil.string2json("false");

	}

	@GET
	@Path("v1/friends/{id}/{type}")
	@Produces("application/json;charset=utf-8")
	public User[] getFriends(@PathParam("id") Integer id,@PathParam("type") Integer type) throws Exception {

		User user = this.userDAO.findById(id);
		List relationships = this.getCriteria().add(Restrictions.eq(RelationshipDAO.USER, user))
												.list();
				
		if (relationships.size() > 0) {
			List friend_list = new ArrayList();
			for (Object relationship : relationships) {
				if (relationship instanceof Relationship
						&& ((Relationship) relationship).getRelationship() == type) {
					Integer friend_id = ((Relationship) relationship)
							.getFriendId();
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
	}


}