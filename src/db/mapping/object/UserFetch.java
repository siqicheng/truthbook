package db.mapping.object;

import java.sql.Timestamp;

/**
 * UserFetch entity. @author MyEclipse Persistence Tools
 */

public class UserFetch implements java.io.Serializable {

	// Fields
	private Integer userId;
	private User user;
	private Timestamp lastFetchTime;

	// Constructors

	/** default constructor */
	public UserFetch() {
	}

	/** full constructor */
	public UserFetch(User user, Timestamp lastFetchTime) {
		this.user = user;
		this.lastFetchTime = lastFetchTime;
	}

	// Property accessors


	public User getUser() {
		return this.user;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Timestamp getLastFetchTime() {
		return this.lastFetchTime;
	}

	public void setLastFetchTime(Timestamp lastFetchTime) {
		this.lastFetchTime = lastFetchTime;
	}

}