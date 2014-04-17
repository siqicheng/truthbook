package testRest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import db.mapping.object.User;
import db.mapping.object.UserDAO;

@Path("login")
public class Login {

	@GET
	@Path("id/{id}")
	@Produces("application/json")
	public User getUser(@PathParam("id") Integer id) {
		User user = new User();
		UserDAO userdao = new UserDAO();
		user = userdao.findById(id);
		return user;
	}
}