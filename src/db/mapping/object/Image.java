package db.mapping.object;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.xml.bind.annotation.XmlMimeType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlTransient;

import db.mapping.object.DAO.UserDAO;

/**
 * Image entity. @author MyEclipse Persistence Tools
 */
@XmlRootElement
@XmlSeeAlso({Portrait.class, ImageComment.class})
public class Image implements java.io.Serializable {
	
	// Fields
	private Integer imageId;
	private User user;
	private String imageUrl;
	private Date createDate;
	private Date lastModified;
	private Integer uploaderId;
	private Boolean approved;
	private Boolean deleted;
	private String content;
	private String uploaderName;	
	private Integer liked;
	private Integer commentCnt;
	private Set imageComments = new HashSet(0);
	private Set portraits = new HashSet(0);
	private Set messages = new HashSet(0);

	// Constructors

	/** default constructor */
	public Image() {
		this.liked = 0;
	}
	
	/** minimal constructor */
	public Image(String imageUrl, User user, String content, Date createDate, Date lastModified,
			Boolean approved, Boolean deleted) {
		this.imageUrl = imageUrl;
		this.user = user;
		this.content = content;
		this.createDate = createDate;
		this.lastModified = lastModified;
		this.approved = approved;
		this.deleted = deleted;
	}

	/** full constructor */
	public Image(String imageUrl, Date createDate, Date lastModified,
			Integer uploaderId, Boolean approved, Boolean deleted,
			Set imageComments, Set portraits) {
		this.imageUrl = imageUrl;
		this.createDate = createDate;
		this.lastModified = lastModified;
		this.uploaderId = uploaderId;
		this.approved = approved;
		this.deleted = deleted;
		this.imageComments = imageComments;
		this.portraits = portraits;
	}

	// Property accessors
	@XmlTransient
	public Set getImageComments() {
		return this.imageComments;
	}
	
	@XmlTransient
	public Set getPortraits() {
		return this.portraits;
	}
	
	@XmlTransient
	public Integer getCommentCnt(){
		return this.imageComments.size();
	}
	
	public String getUploaderName() {
		if (this.uploaderId != null) {
			return  new UserDAO().findById(this.uploaderId).getFullName();
		}
		else return null;
	}

	
	public Integer getLiked(){
		return this.liked;
	}
	
	public User getUser(){
		return this.user;
	}
	
	
	@XmlTransient
	public Set getMessages() {
		return messages;
	}

	@XmlTransient
	public Integer getUserId(){
		return this.user.getUserId();
	}

	public String getContent(){
		return this.content;
	}
	
	public Integer getImageId() {
		return this.imageId;
	}

	public String getImageUrl() {
		return this.imageUrl;
	}

	public Date getCreateDate() {
		return this.createDate;
	}

	@XmlTransient
	public Date getLastModified() {
		return this.lastModified;
	}
	
	public Integer getUploaderId() {
		return this.uploaderId;
	}
	
	public Boolean getApproved() {
		return this.approved;
	}
	
	@XmlTransient
	public Boolean getDeleted() {
		return this.deleted;
	}
	
	public void setMessages(Set messages) {
		this.messages = messages;
	}

	public void setLiked(Integer liked){
		this.liked = liked;
	}
	
	public void setUploaderName(String uploaderName) {
		this.uploaderName = uploaderName;
	}

	public void setCommentCnt(Integer commentCnt){
		this.commentCnt = commentCnt;
	}
	
	
	public void setContent(String content){
		this.content = content;
	}
	
	
	public void setUser(User user){
		this.user = user;
	}
	

	public void setImageId(Integer imageId) {
		this.imageId = imageId;
	}
	

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	

	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}

	

	public void setUploaderId(Integer uploaderId) {
		this.uploaderId = uploaderId;
	}



	public void setApproved(Boolean approved) {
		this.approved = approved;
	}
	

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}
	

	public void setImageComments(Set imageComments) {
		this.imageComments = imageComments;
	}
	
	public void setPortraits(Set portraits) {
		this.portraits = portraits;
	}

}