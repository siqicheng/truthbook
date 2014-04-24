//package restful.gateway;
//
//import java.util.List;
//
//import javax.ws.rs.FormParam;
//import javax.ws.rs.GET;
//import javax.ws.rs.POST;
//import javax.ws.rs.PUT;
//import javax.ws.rs.Path;
//import javax.ws.rs.PathParam;
//import javax.ws.rs.Produces;
//import javax.ws.rs.core.MediaType;
//
//import org.hibernate.Session;
//import org.hibernate.Transaction;
//
//import db.mapping.object.User;
//import db.mapping.object.UserPassword;
//import db.mapping.object.UserPasswordDAO;
//import db.mapping.object.UserPasswordId;
//import db.mapping.object.UserDAO;
//
//@Path("loginService")
//public class LoginService {
//	
//	private User user;
//	private UserDAO userDAO;
//	private UserPassword userPassword;
//	private UserPasswordDAO userPasswordDAO;
//	
//	public LoginService(){
//		user = new User();
//		userDAO = new UserDAO();
//		userPassword = new UserPassword();
//		userPasswordDAO = new UserPasswordDAO();
//	}
//	
//	
//
//	@GET
//	@Path("v1/{id}")
//	@Produces(MediaType.APPLICATION_JSON)
//	public User getUser(@PathParam("id") Integer id) {
//		this.user = this.userDAO.findById(id);
//		return this.user;
//	}
//		
//	@GET
//	@Path("v1/email/{email}/verify")
//	@Produces(MediaType.APPLICATION_JSON)
//	public String emailExist(@PathParam("email") String email) {
//		List email_list = this.userDAO.findByEmail(email);
//		String retValue = email_list.isEmpty()?"false":"true";
//		return RestUtil.string2json(retValue);
//	}
//
//	@POST
//	@Path("v1/user/verify")
//	@Produces(MediaType.APPLICATION_JSON)
//	public List<User> userExist(
//			@FormParam("fullName") String fullName,			
//			@FormParam("school") String school,			
//			@FormParam("entryTime") String entryTime){
//		this.user.setFullName(fullName);
//		this.user.setSchool(school);
//		this.user.setEntryTime(entryTime);
//		this.user.setIsActivated(false);
//		List<User> users = this.userDAO.findByExample(this.user);
//		return users;		
//	}
//	
//	@POST
//	@Path("v1/user/active/verify")
//	@Produces(MediaType.APPLICATION_JSON)
//	public List<User> userActiveExist(
//			@FormParam("fullName") String fullName,			
//			@FormParam("school") String school,			
//			@FormParam("entryTime") String entryTime){
//		this.user.setFullName(fullName);
//		this.user.setSchool(school);
//		this.user.setEntryTime(entryTime);
//		this.user.setIsActivated(true);
//		List<User> users = this.userDAO.findByExample(this.user);
//		return users;		
//	}	
//	
//	@POST
//	@Path("v1/login")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Object login(@FormParam("email") String email,@FormParam("password") String password) {
//		this.user.setEmail(email);
//		this.user.setIsActivated(true);
//		List user_list = this.userDAO.findByExample(this.user);
//		if(user_list.size() == 1){
//			this.user = (User) user_list.get(0);			
//			this.userPassword = this.userPasswordDAO.findById(new UserPasswordId(email,password));
//			if(this.userPassword != null){
//				return this.user;
//			}
//		}
//		return RestUtil.string2json("false");
//	}
//		
//	@POST
//	@Path("v1/full/register")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Object fullRegister(
//			@FormParam("fullName") String fullName,			
//			@FormParam("school") String school,			
//			@FormParam("entryTime") String entryTime,
//			@FormParam("email") String email,
//			@FormParam("password") String password){
//		Session session = userDAO.getSession();
//		try{
//			Transaction tx = session.beginTransaction();
//			
//			this.user.setFullName(fullName);
//			this.user.setEmail(email);
//			this.user.setSchool(school);			
//			this.user.setEntryTime(entryTime);
//			this.user.setIsActivated(false);	
//			
//			this.userPassword = new UserPassword(new UserPasswordId(email,password),this.user);
//			this.user.setUserPassword(userPassword);
//			this.user.setIsActivated(true);
//									
//			userDAO.save(this.user);
//			tx.commit();
//			return this.user;
//		}catch (Exception e){
//			e.printStackTrace();
//			session.close();
//			return RestUtil.string2json("false");
//		}		
//	}
//	
//	@POST
//	@Path("v1/quote/register")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Object quoteRegister(
//			@FormParam("fullName") String fullName,			
//			@FormParam("school") String school,			
//			@FormParam("entryTime") String entryTime){
//		Session session = userDAO.getSession();
//		try{
//			Transaction tx = session.beginTransaction();
//			
//			this.user.setFullName(fullName);
//			this.user.setSchool(school);			
//			this.user.setEntryTime(entryTime);
//			this.user.setIsActivated(false);	
//			
//			userDAO.save(this.user);
//			tx.commit();
//			return this.user;
//		}catch (Exception e){
//			e.printStackTrace();
//			session.close();
//			return RestUtil.string2json("false");
//		}		
//	}
//	
//	@POST
//	@Path("v1/takeQuote/register")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Object takeQuoteRegister(
//			@FormParam("user_id") Integer id,
//			@FormParam("email") String email,
//			@FormParam("password") String password){
//		
//		this.user = this.userDAO.findById(id);
//		if(this.user==null){
//			return RestUtil.string2json("false");
//		}
//		
//		Session session = userDAO.getSession();
//		try{
//			Transaction tx = session.beginTransaction();
//			this.user = this.userDAO.findById(id);
//			this.user.setEmail(email);
//			this.userPassword = new UserPassword(new UserPasswordId(email,password),this.user);
//			this.user.setUserPassword(userPassword);
//			this.user.setIsActivated(true);						
//			userDAO.save(this.user);
//			tx.commit();
//			return this.user;
//		}catch (Exception e){
//			e.printStackTrace();
//			session.close();
//			return RestUtil.string2json("false");
//		}		
//	}
//	
//	@PUT
//	@Path("v1/update")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Object updateUser(
//			@FormParam("user_id") Integer id,
//			@FormParam("fullName") String fullName,			
//			@FormParam("school") String school,			
//			@FormParam("entryTime") String entryTime,
//			@FormParam("email") String email,
//			@FormParam("password") String password){
//		
//		this.user = this.userDAO.findById(id);
//		if(this.user==null){
//			return RestUtil.string2json("false");
//		}
//		
//		Session session = userDAO.getSession();	
//		try{
//			Transaction tx = session.beginTransaction();
//			
//			this.user.setFullName(fullName);
//			this.user.setEmail(email);
//			this.user.setSchool(school);			
//			this.user.setEntryTime(entryTime);			
//			this.userPassword = new UserPassword(new UserPasswordId(email,password),this.user);
//			this.user.setUserPassword(userPassword);
//			userDAO.update(this.user);
//			tx.commit();
//			return this.user;
//		}catch (Exception e){
//			e.printStackTrace();
//			session.close();
//			return RestUtil.string2json("false");
//		}		
//	}
//	
//	@GET
//	@Path("v1/fullName/{fullName}/verify")
//	@Produces("application/json")
//	public List<User> findUserByFullName(@PathParam("fullName") String fullName) {
//		List<User> fullName_list = this.userDAO.findByFullName(fullName);
//		return fullName_list;
//	}
//	
//
//
//}

package restful.gateway;

import java.util.Iterator;
import java.util.List;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;

import db.mapping.object.User;
import db.mapping.object.UserPassword;
import db.mapping.object.UserPasswordDAO;
import db.mapping.object.UserPasswordId;
import db.mapping.object.UserDAO;

@Path("loginService")
public class LoginService {
	
	private User user;
	private UserDAO userDAO;
	private UserPassword userPassword;
	private UserPasswordDAO userPasswordDAO;
	
	public LoginService(){
		user = new User();
		userDAO = new UserDAO();
		userPassword = new UserPassword();
		userPasswordDAO = new UserPasswordDAO();
	}
	
	

	@GET
	@Path("v1/{id}")
	@Produces("application/json;charset=utf-8")
	public User getUser(@PathParam("id") Integer id) {
		this.user = this.userDAO.findById(id);
		return this.user;
	}
		
	@GET
	@Path("v1/email/{email}/verify")
	@Produces("application/json;charset=utf-8")
	public String emailExist(@PathParam("email") String email) {
		List email_list = this.userDAO.findByEmail(email);
		String retValue = email_list.isEmpty()?"false":"true";
		return RestUtil.string2json(retValue);
	}
	
	@GET
	@Path("v1/fullName/{fullName}/verify")
	@Produces("application/json;charset=utf-8")
	public List<User> findUserByFullName(@PathParam("fullName") String fullName) {
		List<User> fullName_list = this.userDAO.findByFullName(fullName);
		return fullName_list;
	}
	
	@GET
	@Path("v1/prefix/{prefix}/verify")
	@Produces("application/json;charset=utf-8")
	public List<User> findUserByPartOfName(@PathParam("prefix") String part) {
		Criteria criteria = this.userDAO.getSession().createCriteria(User.class);
		criteria.add(Restrictions.like(UserDAO.FULL_NAME, part , MatchMode.START));
		return criteria.list();
	}
	
	@POST
	@Path("v1/user/verify")
	@Produces("application/json;charset=utf-8")
	public List<User> userExist(
			@FormParam("fullName") String fullName,			
			@FormParam("school") String school,			
			@FormParam("entryTime") String entryTime){
		this.user.setFullName(fullName);
		this.user.setSchool(school);
		this.user.setEntryTime(entryTime);
//		this.user.setIsActivated(false);
		List<User> users = this.userDAO.findByExample(this.user);
		
		return users;		
	}
	
	@POST
	@Path("v1/login")
	@Produces("application/json;charset=utf-8")
	public Object login(@FormParam("email") String email,@FormParam("password") String password) {
		this.user.setEmail(email);
		this.user.setIsActivated(true);
		List user_list = this.userDAO.findByExample(this.user);
		if(user_list.size() == 1){
			this.user = (User) user_list.get(0);			
			this.userPassword = this.userPasswordDAO.findById(new UserPasswordId(email,password));
			
			
			if(this.userPassword != null){
				return this.user;
			}
		}
		return RestUtil.string2json("false");
	}
		
	@POST
	@Path("v1/full/register")
	@Produces("application/json;charset=utf-8")
	public Object fullRegister(
			@FormParam("fullName") String fullName,			
			@FormParam("school") String school,			
			@FormParam("entryTime") String entryTime,
			@FormParam("email") String email,
			@FormParam("password") String password){
		Session session = userDAO.getSession();
		try{
			Transaction tx = session.beginTransaction();
			
			this.user.setFullName(fullName);
			this.user.setEmail(email);
			this.user.setSchool(school);			
			this.user.setEntryTime(entryTime);
			this.user.setIsActivated(false);	
			
			this.userPassword = new UserPassword(new UserPasswordId(email,password),this.user);
			this.user.setUserPassword(userPassword);
			this.user.setIsActivated(true);
									
			userDAO.save(this.user);
			tx.commit();
			return this.user;
		}catch (Exception e){
			e.printStackTrace();
			session.close();
			return RestUtil.string2json("false");
		}		
	}
	
	@POST
	@Path("v1/quote/register")
	@Produces("application/json;charset=utf-8")
	public Object quoteRegister(
			@FormParam("fullName") String fullName,			
			@FormParam("school") String school,			
			@FormParam("entryTime") String entryTime){
		Session session = userDAO.getSession();
		try{
			Transaction tx = session.beginTransaction();
			
			this.user.setFullName(fullName);
			this.user.setSchool(school);			
			this.user.setEntryTime(entryTime);
			this.user.setIsActivated(false);	
			
			userDAO.save(this.user);
			tx.commit();
			return this.user;
		}catch (Exception e){
			e.printStackTrace();
			session.close();
			return RestUtil.string2json("false");
		}		
	}
	
	@POST
	@Path("v1/takeQuote/register")
	@Produces("application/json;charset=utf-8")
	public Object takeQuoteRegister(
			@FormParam("user_id") Integer id,
			@FormParam("email") String email,
			@FormParam("password") String password){
		
		this.user = this.userDAO.findById(id);
		if(this.user==null){
			return RestUtil.string2json("false");
		}
		
		Session session = userDAO.getSession();
		try{
			Transaction tx = session.beginTransaction();
			this.user = this.userDAO.findById(id);
			this.user.setEmail(email);
			this.userPassword = new UserPassword(new UserPasswordId(email,password),this.user);
			this.user.setUserPassword(userPassword);
			this.user.setIsActivated(true);						
//			userDAO.update(this.user);
			session.update(this.user);
			session.save(this.userPassword);
			tx.commit();
			return this.user;
		}catch (Exception e){
			e.printStackTrace();
			session.close();
			return RestUtil.string2json("false");
		}		
	}
	
	@PUT
	@Path("v1/update")
	@Produces("application/json;charset=utf-8")
	public Object updateUser(
			@FormParam("user_id") Integer id,
			@FormParam("fullName") String fullName,			
			@FormParam("school") String school,			
			@FormParam("entryTime") String entryTime,
			@FormParam("email") String email,
			@FormParam("password") String password){
		
		this.user = this.userDAO.findById(id);
		if(this.user==null){
			return RestUtil.string2json("false");
		}
		
		Session session = userDAO.getSession();	
		try{
			Transaction tx = session.beginTransaction();
			
			this.user.setFullName(fullName);
			this.user.setEmail(email);
			this.user.setSchool(school);			
			this.user.setEntryTime(entryTime);			
			this.userPassword = new UserPassword(new UserPasswordId(email,password),this.user);
			this.user.setUserPassword(userPassword);
			userDAO.update(this.user);
			tx.commit();
			return this.user;
		}catch (Exception e){
			e.printStackTrace();
			session.close();
			return RestUtil.string2json("false");
		}		
	}
		
}
