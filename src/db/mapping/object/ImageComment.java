package db.mapping.object;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * ImageComment entity. @author MyEclipse Persistence Tools
 */
@XmlRootElement
public class ImageComment implements java.io.Serializable {
	
	// Table Name
	
	public static final String TABLE = "ImageComment";
	
	// DB Mapping info
	
	public static final String ID = "id";
	public static final String IMAGE = "image";
	public static final String COMMENT = "comment";
	
	
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

	public Image getImage() {
		return this.image;
	}

	public void setImage(Image image) {
		this.image = image;
	}

	public Comment getComment() {
		return this.comment;
	}

	public void setComment(Comment comment) {
		this.comment = comment;
	}

}