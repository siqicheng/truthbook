package db.mapping.object;

import javax.xml.bind.annotation.XmlTransient;

/**
 * Relationship entity. @author MyEclipse Persistence Tools
 */

public class Relationship implements java.io.Serializable {
	
	// Table Name
	
	public static final String TABLE = "Relationship";
	
	// DB Mapping info
	
	public static final String USER_ID = "user";
	public static final String FRIEND_ID = "friendId";
	public static final String RELATIONSHIP = "relationship";
	public static final String IS_INVITEE = "isInvitee";
	// Fields

	private Integer id;
	private User user;
	private Integer friendId;
	private String relationship;
	private Boolean isInvitee;

	// Constructors

	/** default constructor */
	public Relationship() {
	}

	/** full constructor */
	public Relationship(User user, Integer friendId, String relationship,
			Boolean isInvitee) {
		this.user = user;
		this.friendId = friendId;
		this.relationship = relationship;
		this.isInvitee = isInvitee;
	}

	// Property accessors

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}
	@XmlTransient
	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Integer getFriendId() {
		return this.friendId;
	}

	public void setFriendId(Integer friendId) {
		this.friendId = friendId;
	}

	public String getRelationship() {
		return this.relationship;
	}

	public void setRelationship(String relationship) {
		this.relationship = relationship;
	}

	public Boolean getIsInvitee() {
		return this.isInvitee;
	}

	public void setIsInvitee(Boolean isInvitee) {
		this.isInvitee = isInvitee;
	}

}