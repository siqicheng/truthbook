package db.mapping.object;


import java.util.HashSet;
import java.util.Set;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlTransient;


import db.mapping.object.UserPassword;


/**
 * User entity. @author MyEclipse Persistence Tools
 */
@XmlRootElement
@XmlSeeAlso({UserPassword.class,Relationship.class,Message.class})
public class User  implements java.io.Serializable {


    // Fields    

     private Integer userId;
     private String fullName;
     private String email;
     private String school;
     private String entryTime;
     private Boolean isActivated;
     private Set comments = new HashSet(0);
     private Set relationships = new HashSet(0);
     private Set portraits = new HashSet(0);
     private UserPassword userPassword;
     private Set messages = new HashSet(0);
    // Constructors

    /** default constructor */
    public User() {
    }

	/** minimal constructor */
    public User(String fullName, String school, String entryTime, Boolean isActivated) {
        this.fullName = fullName;
        this.school = school;
        this.entryTime = entryTime;
        this.isActivated = isActivated;
    }
    
    /** full constructor */
    public User(String fullName, String email, String school, String entryTime, Boolean isActivated, Set comments, Set relationships, Set portraits,UserPassword userPassword) {
        this.fullName = fullName;
        this.email = email;
        this.school = school;
        this.entryTime = entryTime;
        this.isActivated = isActivated;
        this.comments = comments;
        this.relationships = relationships;
        this.portraits = portraits;
        this.userPassword = userPassword;
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

    public String getEntryTime() {
        return this.entryTime;
    }
    
    public void setEntryTime(String entryTime) {
        this.entryTime = entryTime;
    }

    public Boolean getIsActivated() {
        return this.isActivated;
    }
    
    public void setIsActivated(Boolean isActivated) {
        this.isActivated = isActivated;
    }
    @XmlTransient
    public Set getComments() {
        return this.comments;
    }
    
    @XmlTransient
    public Set getMessages(){
    	return this.messages;
    }
    
    
    public void setMessages(Set messages){
    	this.messages=messages;
    }
    
    
    public void setComments(Set comments) {
        this.comments = comments;
    }
    @XmlTransient
    public Set getRelationships() {
        return this.relationships;
    }
    
    public void setRelationships(Set relationships) {
        this.relationships = relationships;
    }
    @XmlTransient
    public Set getPortraits() {
        return this.portraits;
    }
    
    public void setPortraits(Set portraits) {
        this.portraits = portraits;
    }
    @XmlTransient
    public UserPassword getUserPassword() {
		return this.userPassword;
	}

	public void setUserPassword(UserPassword userPassword) {
		this.userPassword = userPassword;
	}
	
}
