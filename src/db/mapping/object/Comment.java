package db.mapping.object;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlTransient;

import org.hibernate.Session;

import db.mapping.object.DAO.UserDAO;

/**
 * Comment entity. @author MyEclipse Persistence Tools
 */
@XmlRootElement
@XmlSeeAlso({User.class})
public class Comment implements java.io.Serializable {
	
	// Fields

	private Integer commentId;
	private User user;
	private String commentContent;
	private Integer repliedToCommentId;
	private String repliedToCommentName;

	private Integer repliedByCommentId;
	private String repliedByCommentName;
	private String repliedByCommentPortrait;
	private Date createDate;
	private Set imageComments = new HashSet(0);
	

	// Constructors

	/** default constructor */
	public Comment() {
	}

	/** minimal constructor */
	public Comment(User user, Date createDate) {
		this.user = user;
		this.createDate = createDate;
	}

	/** full constructor */
	public Comment(User user, String commentContent,
			Integer repliedToCommentId, Integer repliedByCommentId,
			Date createDate, Set imageComments) {
		this.user = user;
		this.commentContent = commentContent;
		this.repliedToCommentId = repliedToCommentId;
		this.repliedByCommentId = repliedByCommentId;
		this.createDate = createDate;
		this.imageComments = imageComments;
	}

	// Property accessors
	
	//@XmlTransient
	public String getRepliedToCommentName() {
		if  (this.repliedToCommentId != null)
			return new UserDAO().findById(this.repliedToCommentId).getFullName();
		else 	return null;
	}
	
	//@XmlTransient
	public String getRepliedByCommentName() {
		if (this.repliedByCommentId != null)
			return new UserDAO().findById(this.repliedByCommentId).getFullName();
		else 	return null;
	}
	
	//@XmlTransient
	public String getRepliedByCommentPortrait() {
		if  (this.repliedByCommentId != null)
			return new UserDAO().findById(repliedByCommentId).getDefaultPortrait();
		else 	return null;
	}


	public void setRepliedToCommentName(String repliedToCommentName) {
		this.repliedToCommentName = repliedToCommentName;
	}

	
	public void setRepliedByCommentName(String repliedByCommentName) {
		this.repliedByCommentName = repliedByCommentName;
	}

	
	public void setRepliedByCommentPortrait(String repliedByCommentPortrait) {
		this.repliedByCommentPortrait = repliedByCommentPortrait;
	}

	public Integer getCommentId() {
		return this.commentId;
	}

	public void setCommentId(Integer commentId) {
		this.commentId = commentId;
	}

	@XmlTransient
	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getCommentContent() {
		return this.commentContent;
	}

	public void setCommentContent(String commentContent) {
		this.commentContent = commentContent;
	}

	public Integer getRepliedToCommentId() {
		return this.repliedToCommentId;
	}

	public void setRepliedToCommentId(Integer repliedToCommentId) {
		this.repliedToCommentId = repliedToCommentId;
	}

	public Integer getRepliedByCommentId() {
		return this.repliedByCommentId;
	}

	public void setRepliedByCommentId(Integer repliedByCommentId) {
		this.repliedByCommentId = repliedByCommentId;
	}

	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	@XmlTransient
	public Set getImageComments() {
		return this.imageComments;
	}

	public void setImageComments(Set imageComments) {
		this.imageComments = imageComments;
	}

}