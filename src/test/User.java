package test;

import java.util.HashSet;
import java.util.Set;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSeeAlso;

/**
 * User entity. @author MyEclipse Persistence Tools
 */
@XmlRootElement
@XmlSeeAlso({Relationship.class,Comment.class,Portrait.class})
public class User implements java.io.Serializable {

	// Fields

	private Integer userId;
	private String fullName;
	private String email;
	private String school;
	private String password;
	private String entryTime;
	private Set comments = new HashSet(0);
	private Set relationships = new HashSet(0);
	private Set portraits = new HashSet(0);

	// Constructors

	/** default constructor */
	public User() {
	}

	/** minimal constructor */
	public User(String fullName, String email, String school, String password,
			String entryTime) {
		this.fullName = fullName;
		this.email = email;
		this.school = school;
		this.password = password;
		this.entryTime = entryTime;
	}

	/** full constructor */
	public User(String fullName, String email, String school, String password,
			String entryTime, Set comments, Set relationships, Set portraits) {
		this.fullName = fullName;
		this.email = email;
		this.school = school;
		this.password = password;
		this.entryTime = entryTime;
		this.comments = comments;
		this.relationships = relationships;
		this.portraits = portraits;
	}

	// Property accessors

	public Integer getUserId() {
		return this.userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getFullName() {
		return this.fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSchool() {
		return this.school;
	}

	public void setSchool(String school) {
		this.school = school;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEntryTime() {
		return this.entryTime;
	}

	public void setEntryTime(String entryTime) {
		this.entryTime = entryTime;
	}

	public Set getComments() {
		return this.comments;
	}

	public void setComments(Set comments) {
		this.comments = comments;
	}

	public Set getRelationships() {
		return this.relationships;
	}
	
	public void setRelationships(Set relationships) {
		this.relationships = relationships;
	}

	public Set getPortraits() {
		return this.portraits;
	}

	public void setPortraits(Set portraits) {
		this.portraits = portraits;
	}

}