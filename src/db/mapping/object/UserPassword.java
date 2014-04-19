package db.mapping.object;

import javax.xml.bind.annotation.XmlTransient;

/**
 * UserPassword entity. @author MyEclipse Persistence Tools
 */

public class UserPassword implements java.io.Serializable {

	// Fields

	private UserPasswordId id;
	private User user;

	// Constructors

	/** default constructor */
	public UserPassword() {
	}

	/** full constructor */
	public UserPassword(UserPasswordId id, User user) {
		this.id = id;
		this.user = user;
	}

	// Property accessors

	public UserPasswordId getId() {
		return this.id;
	}

	public void setId(UserPasswordId id) {
		this.id = id;
	}

	@XmlTransient
	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}

}