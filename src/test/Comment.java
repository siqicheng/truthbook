package test;

import java.util.HashSet;
import java.util.Set;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlTransient;

/**
 * Comment entity. @author MyEclipse Persistence Tools
 */
@XmlRootElement
@XmlSeeAlso({ImageComment.class})
public class Comment implements java.io.Serializable {

	// Fields

	private Integer commentId;
	private User user;
	private String commentContent;
	private Integer repliedToCommentId;
	private Integer repliedByCommentId;
	private Set imageComments = new HashSet(0);

	// Constructors

	/** default constructor */
	public Comment() {
	}

	/** minimal constructor */
	public Comment(User user) {
		this.user = user;
	}

	/** full constructor */
	public Comment(User user, String commentContent,
			Integer repliedToCommentId, Integer repliedByCommentId,
			Set imageComments) {
		this.user = user;
		this.commentContent = commentContent;
		this.repliedToCommentId = repliedToCommentId;
		this.repliedByCommentId = repliedByCommentId;
		this.imageComments = imageComments;
	}

	// Property accessors

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

	public Set getImageComments() {
		return this.imageComments;
	}

	public void setImageComments(Set imageComments) {
		this.imageComments = imageComments;
	}

}