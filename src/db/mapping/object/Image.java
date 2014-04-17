package db.mapping.object;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlTransient;

/**
 * Image entity. @author MyEclipse Persistence Tools
 */
@XmlRootElement
@XmlSeeAlso({Portrait.class, ImageComment.class})
public class Image implements java.io.Serializable {
	
	// Table Name
	
	public static final String TABLE = "Image";
	
	// DB Mapping info
	public static final String IMAGE_ID = "imageId";
	public static final String IMAGE_URL = "imageUrl";
	public static final String CREATE_DATE = "createDate";
	public static final String LASTE_MODIFIED = "lastModified";
	public static final String UPLOADER_ID = "uploaderId";
	public static final String APPROVED = "approved";
	public static final String DELETED = "deleted";
	public static final String USER_ID = "userId";
	public static final String CONTENT = "content";
	
	
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
	private Set imageComments = new HashSet(0);
	private Set portraits = new HashSet(0);

	// Constructors

	/** default constructor */
	public Image() {
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
	public Integer getUserId(){
		return this.user.getUserId();
	}

	public String getContent(){
		return this.content;
	}
	
	public void setContent(String content){
		this.content = content;
	}
	
	public User getUser(){
		return this.user;
	}
	
	public void setUser(User user){
		this.user = user;
	}
	
	
	public Integer getImageId() {
		return this.imageId;
	}

	public void setImageId(Integer imageId) {
		this.imageId = imageId;
	}

	public String getImageUrl() {
		return this.imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	@XmlTransient
	public Date getLastModified() {
		return this.lastModified;
	}

	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}

	public Integer getUploaderId() {
		return this.uploaderId;
	}

	public void setUploaderId(Integer uploaderId) {
		this.uploaderId = uploaderId;
	}

	public Boolean getApproved() {
		return this.approved;
	}

	public void setApproved(Boolean approved) {
		this.approved = approved;
	}

	public Boolean getDeleted() {
		return this.deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}
	@XmlTransient
	public Set getImageComments() {
		return this.imageComments;
	}

	public void setImageComments(Set imageComments) {
		this.imageComments = imageComments;
	}
	@XmlTransient
	public Set getPortraits() {
		return this.portraits;
	}

	public void setPortraits(Set portraits) {
		this.portraits = portraits;
	}

}