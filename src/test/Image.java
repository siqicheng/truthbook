package test;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSeeAlso;

/**
 * Image entity. @author MyEclipse Persistence Tools
 */
@XmlRootElement
@XmlSeeAlso({ImageComment.class,Portrait.class})
public class Image implements java.io.Serializable {

	// Fields

	private Integer imageId;
	private String imageContent;
	private Date createDate;
	private Date lastModified;
	private Integer uploaderId;
	private Set imageComments = new HashSet(0);
	private Set portraits = new HashSet(0);

	// Constructors

	/** default constructor */
	public Image() {
	}

	/** minimal constructor */
	public Image(String imageContent, Date createDate, Date lastModified) {
		this.imageContent = imageContent;
		this.createDate = createDate;
		this.lastModified = lastModified;
	}

	/** full constructor */
	public Image(String imageContent, Date createDate, Date lastModified,
			Integer uploaderId, Set imageComments, Set portraits) {
		this.imageContent = imageContent;
		this.createDate = createDate;
		this.lastModified = lastModified;
		this.uploaderId = uploaderId;
		this.imageComments = imageComments;
		this.portraits = portraits;
	}

	// Property accessors

	public Integer getImageId() {
		return this.imageId;
	}

	public void setImageId(Integer imageId) {
		this.imageId = imageId;
	}

	public String getImageContent() {
		return this.imageContent;
	}

	public void setImageContent(String imageContent) {
		this.imageContent = imageContent;
	}

	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

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

	public Set getImageComments() {
		return this.imageComments;
	}

	public void setImageComments(Set imageComments) {
		this.imageComments = imageComments;
	}

	public Set getPortraits() {
		return this.portraits;
	}

	public void setPortraits(Set portraits) {
		this.portraits = portraits;
	}

}