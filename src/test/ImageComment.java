package test;

import javax.xml.bind.annotation.XmlTransient;

/**
 * ImageComment entity. @author MyEclipse Persistence Tools
 */

public class ImageComment implements java.io.Serializable {

	// Fields

	private Integer id;
	private Image image;
	private Comment comment;

	// Constructors

	/** default constructor */
	public ImageComment() {
	}

	/** full constructor */
	public ImageComment(Image image, Comment comment) {
		this.image = image;
		this.comment = comment;
	}

	// Property accessors

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}
	
	@XmlTransient
	public Image getImage() {
		return this.image;
	}

	public void setImage(Image image) {
		this.image = image;
	}
	
	@XmlTransient
	public Comment getComment() {
		return this.comment;
	}

	public void setComment(Comment comment) {
		this.comment = comment;
	}

}