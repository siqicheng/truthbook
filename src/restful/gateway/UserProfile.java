package restful.gateway;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.hibernate.Session;
import org.hibernate.Transaction;

//import db.mapping.object.Image;
//import db.mapping.object.Portrait;
//import db.mapping.object.PortraitDAO;
import db.mapping.object.Relationship;
import db.mapping.object.RelationshipDAO;
import db.mapping.object.User;
import db.mapping.object.UserDAO;

@Path("userProfile")
public class UserProfile {

	// private PortraitDAO portraitDAO;
	private UserDAO userDAO;
	private RelationshipDAO relationshipDAO;

	public UserProfile() {
		// portraitDAO = new PortraitDAO();
		userDAO = new UserDAO();
		relationshipDAO = new RelationshipDAO();
	}

	//
	// @GET
	// @Path("v1/defaultPortrait/{id}")
	// @Produces("application/json")
	// public Image getDefaultPortrait(@PathParam("id") Integer id){
	// User user = new User();
	// user.setUserId(id);
	//
	// String property[] = {Portrait.USER_ID,Portrait.DEFAULT_IMAGE};
	// Object value[] = {user,"1"};
	//
	// List portrait_list = this.portraitDAO.findByProperties(property, value,
	// Portrait.TABLE);
	// if (portrait_list.size()>0){
	// for (Object portait : portrait_list){
	// if (portait instanceof Portrait){
	// Image image = ((Portrait) portait).getImage();
	// return image;
	// }
	// }
	//
	// }
	// return null;
	// }
	//
	// @GET
	// @Path("v1/allPortrait/{id}")
	// @Produces("application/json")
	// public Image[] getAllPortrait(@PathParam("id") Integer id){
	// User user = new User();
	// user.setUserId(id);
	//
	// String property[] = {Portrait.USER_ID};
	// Object value[] = {user};
	//
	// List portrait_list = this.portraitDAO.findByProperties(property, value,
	// Portrait.TABLE);
	// if (portrait_list.size()>0){
	// List image_list = new ArrayList();
	// for (Object portait : portrait_list){
	// if (portait instanceof Portrait){
	// Image image = ((Portrait) portait).getImage();
	// image_list.add(image);
	// }
	// }
	// Image[] images = new Image[image_list.size()];
	// for (int i=0; i<image_list.size();i++){
	// images[i] = (Image) image_list.get(i);
	// }
	// return images;
	//
	// }
	// return null;
	// }
	//
	// @PUT
	// @Path("v1/setDefaultPortrait/{id}/{image_id}")
	// @Produces(MediaType.TEXT_PLAIN)
	// public String setDefaultPortrait(@PathParam("id") Integer
	// id,@PathParam("image_id") Integer image_id){
	// User user = new User();
	// user.setUserId(id);
	// Image image = new Image();
	// image.setImageId(image_id);
	//
	// String property[] = {Portrait.USER_ID,Portrait.IMAGE_ID};
	// Object value[] = {user,image};
	// Session session = this.portraitDAO.getSession();
	// Transaction tx = session.beginTransaction();
	// try{
	// List portrait_list = this.portraitDAO.findByProperties(property, value,
	// Portrait.TABLE);
	//
	// if (portrait_list.size()>0){
	// for (Object portrait : portrait_list){
	// if (portrait instanceof Portrait){
	// ((Portrait) portrait).setDefaultImage("1");
	// session.save(portrait);
	// }
	// }
	// }
	// tx.commit();
	// session.close();
	// return "true";
	// }catch (Exception e){
	// e.printStackTrace();
	// session.close();
	// return "false";
	// }
	//
	// }
	//
	// @DELETE
	// @Path("v1/deletePortrait/{id}/{image_id}")
	// @Produces(MediaType.TEXT_PLAIN)
	// public String deletePortrait(@PathParam("id") Integer
	// id,@PathParam("image_id") Integer image_id){
	// User user = new User();
	// user.setUserId(id);
	// Image image = new Image();
	// image.setImageId(image_id);
	// String property[] = {Portrait.USER_ID,Portrait.IMAGE_ID};
	// Object value[] = {user,image};
	//
	// Session session = this.portraitDAO.getSession();
	// Transaction tx = session.beginTransaction();
	//
	// try{
	// List portrait_list = this.portraitDAO.findByProperties(property, value,
	// Portrait.TABLE);
	// if (portrait_list.size()>0){
	// for (Object portait : portrait_list){
	// if (portait instanceof Portrait){
	// session.delete(portait);
	// }
	// }
	// }
	// tx.commit();
	// session.close();
	// return "true";
	// }catch (Exception e){
	// e.printStackTrace();
	// session.close();
	// return "false";
	// }
	// }
	//
	//
	@POST
	@Path("v1/friends/add")
	@Produces("application/json;charset=utf-8")

	public Object addFriend(@FormParam("id") Integer id,@FormParam("friend_id") Integer friend_id,@FormParam("type") String type,@FormParam("is_invitee") Boolean is_invitee) {
		
		User user = this.userDAO.findById(id);		
		
		String property[] = {Relationship.USER_ID, Relationship.FRIEND_ID};
		Object value[] = {user,friend_id};			
		Session session = this.relationshipDAO.getSession();
		try {
			List Friends = this.relationshipDAO.findByProperties(property,
					value, Relationship.TABLE);
			if (Friends.size() == 0) {
				Relationship relationship = new Relationship();
				relationship.setId(id);
				relationship.setFriendId(friend_id);
				relationship.setRelationship(type);
				relationship.setIsInvitee(is_invitee);
				relationship.setUser(user);
				Transaction tx = session.beginTransaction();
				session.save(relationship);
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

	@PUT
	@Path("v1/friends/update")
	@Produces("application/json;charset=utf-8")

	public Object updateFriend(@FormParam("id") Integer id,@FormParam("friend_id") Integer friend_id,@FormParam("type") String type,@FormParam("is_invitee") Boolean is_invitee) {

		User user = this.userDAO.findById(id);

		String property[] = { Relationship.USER_ID, Relationship.FRIEND_ID };
		Object value[] = { user, friend_id };

		Session session = this.relationshipDAO.getSession();
		try {
			List Friends = this.relationshipDAO.findByProperties(property,
					value, Relationship.TABLE);
			if (Friends.size() == 1) {
				Transaction tx = session.beginTransaction();
				Object Friend = Friends.get(0);
				if (Friend instanceof Relationship) {
					Relationship relationship = (Relationship) Friend;
					relationship.setIsInvitee(is_invitee);
					relationship.setRelationship(type);
					session.update(relationship);
					tx.commit();
					session.close();
					return RestUtil.string2json("true");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			session.close();
		}

		return RestUtil.string2json("false");

	}

	// winkar modified
	// return 0,1,2 for the exist type of friends ,otherwise return -1
	@GET
	@Path("v1/friends/{id}/{friend_id}/check")
	@Produces("application/json;charset=utf-8")

	public Object checkFriends(@PathParam("id") Integer id,@PathParam("friend_id") Integer friend_id) {
		User user = this.userDAO.findById(id);

		String property[] = { Relationship.USER_ID, Relationship.FRIEND_ID };
		Object value[] = { user, friend_id };

		List Friends = this.relationshipDAO.findByProperties(property, value,
				Relationship.TABLE);
		if (Friends.size() == 1) {
			Object Friend = Friends.get(0);
			if (Friend instanceof Relationship) {
				return RestUtil.string2json(((Relationship) Friend)
						.getRelationship());
			}
		}
		return RestUtil.string2json("-1");
	}

	// winkar modified

	@GET
	@Path("v1/friends/{id}/{friend_id}/delete")
	@Produces("application/json;charset=utf-8")

	public Object deleteFriend(@PathParam("id") Integer id,@PathParam("friend_id") Integer friend_id) {

		User user = this.userDAO.findById(id);

		String property[] = { Relationship.USER_ID, Relationship.FRIEND_ID };
		Object value[] = { user, friend_id };

		Session session = this.relationshipDAO.getSession();
		try {
			List Friends = this.relationshipDAO.findByProperties(property,
					value, Relationship.TABLE);
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
		}

		return RestUtil.string2json("false");

	}

	@GET
	@Path("v1/friends/{id}/{type}")
	@Produces("application/json;charset=utf-8")

	public User[] getFriends(@PathParam("id") Integer id,@PathParam("type") String type) throws Exception {

		User user = this.userDAO.findById(id);

		String property[] = { Relationship.USER_ID, Relationship.RELATIONSHIP };
		Object value[] = { user, type };

		List relationships = this.relationshipDAO.findByProperties(property,
				value, Relationship.TABLE);
		if (relationships.size() > 0) {
			List friend_list = new ArrayList();
			for (Object relationship : relationships) {
				if (relationship instanceof Relationship) {
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
	//
	// @PUT
	// @Path("v1/updateFriend/{user_id}/{friend_id}/{rs_type}")
	// @Produces(MediaType.TEXT_PLAIN)
	// public String updateFriend(@PathParam("user_id") Integer
	// user_id,@PathParam("friend_id") Integer friend_id,@PathParam("rs_type")
	// String rs_type){
	// User user = new User();
	// user.setUserId(user_id);
	//
	// String property[] = {Relationship.USER_ID,Relationship.FRIEND_ID};
	// Object value[] = {user,friend_id};
	// Session session = this.relationshipDAO.getSession();
	// Transaction tx = session.beginTransaction();
	// try{
	// List relationship_list =
	// this.relationshipDAO.findByProperties(property,value,Relationship.TABLE);
	//
	// if(relationship_list.size()>0){
	// for (Object relationship : relationship_list){
	// if (relationship instanceof Relationship){
	// ((Relationship) relationship).setRelationship(rs_type);
	// session.update(relationship);
	// }
	// }
	// }
	// tx.commit();
	// session.close();
	// return "true";
	// }catch (Exception e){
	// e.printStackTrace();
	// session.close();
	// return "false";
	// }
	//
	// }
	//
	// @POST
	// @Path("v1/addFriend")
	// @Produces(MediaType.TEXT_PLAIN)
	// public String addFriend(@FormParam("user_id") Integer
	// user_id,@FormParam("friend_id") Integer friend_id,@FormParam("rs_type")
	// String rs_type,@FormParam("is_invitee") String is_invitee){
	// User user = new User();
	// user.setUserId(user_id);
	//
	// String property[] =
	// {Relationship.USER_ID,Relationship.FRIEND_ID,Relationship.RELATIONSHIP};
	// Object value[] = {user,friend_id,rs_type};
	// Session session = this.relationshipDAO.getSession();
	// Transaction tx = session.beginTransaction();
	// try{
	// List relationship_list =
	// this.relationshipDAO.findByProperties(property,value,Relationship.TABLE);
	//
	// if(relationship_list.size()==0){
	// session.save(new Relationship(user,friend_id,rs_type,is_invitee));
	// }
	// tx.commit();
	// session.close();
	// return "true";
	// }catch (Exception e){
	// e.printStackTrace();
	// session.close();
	// return "false";
	// }
	// }
	//
	// @DELETE
	// @Path("v1/deleteFriend/{user_id}/{friend_id}/{rs_type}")
	// @Produces(MediaType.TEXT_PLAIN)
	// public String deleteFriend(@PathParam("user_id") Integer
	// user_id,@PathParam("friend_id") Integer friend_id,@PathParam("rs_type")
	// String rs_type){
	// User user = new User();
	// user.setUserId(user_id);
	//
	// String property[] =
	// {Relationship.USER_ID,Relationship.FRIEND_ID,Relationship.RELATIONSHIP};
	// Object value[] = {user,friend_id,rs_type};
	// Session session = this.relationshipDAO.getSession();
	// Transaction tx = session.beginTransaction();
	//
	// try{
	// List relationship_list =
	// this.relationshipDAO.findByProperties(property,value,Relationship.TABLE);
	//
	// if(relationship_list.size()>0){
	// for (Object relationship : relationship_list){
	// if (relationship instanceof Relationship){
	// session.delete((Relationship)relationship);
	// }
	// }
	// }
	// tx.commit();
	// session.close();
	// return "true";
	// }catch (Exception e){
	// e.printStackTrace();
	// session.close();
	// return "false";
	// }
	// }

}