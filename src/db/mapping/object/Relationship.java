package db.mapping.object;

import javax.xml.bind.annotation.XmlTransient;

/**
 * Relationship entity. @author MyEclipse Persistence Tools
 */

public class Relationship implements java.io.Serializable {
	// Fields

	private Integer id;
	private User user;
	private Integer friendId;
	private Integer relationship;
	private Boolean isInvitee;

	public static final Integer E_FRIEND = 6;
	public static final Integer N_FRIEND_LEVEL = 1;
	public static final Integer E_FRIEND_LEVEL = 2;

	
	// Constructors

	/** default constructor */
	public Relationship() {
	}

	/** full constructor */
	public Relationship(User user, Integer friendId, Integer relationship,
			Boolean isInvitee) {
		this.user = user;
		this.friendId = friendId;
		this.relationship = relationship;
		this.isInvitee = isInvitee;
	}
	

	public boolean levelUp(){
		if (this.relationship <6 ){
			this.relationship += 1;
			if (this.relationship == 6){
				return true;
			}
		}
		return false;
	}
	
	public void levelDown(){
		this.relationship = 1;
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

	public Integer getRelationship() {
		if (this.relationship >= this.E_FRIEND) {
			return this.E_FRIEND_LEVEL;
		}
		else return this.N_FRIEND_LEVEL;
	}

	public void setRelationship(Integer relationship) {
		this.relationship = relationship;
	}

	public Boolean getIsInvitee() {
		return this.isInvitee;
	}

	public void setIsInvitee(Boolean isInvitee) {
		this.isInvitee = isInvitee;
	}

}