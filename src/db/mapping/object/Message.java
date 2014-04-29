package db.mapping.object;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlTransient;

import db.mapping.object.User;

/**
 * Message entity. @author MyEclipse Persistence Tools
 */

@XmlRootElement
@XmlSeeAlso({User.class})
public class Message implements java.io.Serializable {

	// Fields

	private Integer messageId;
	private String messageType;
	private Integer userId;
	private User friend;
	private String content;
	private Timestamp createTime;
	private Integer ImageId;
	//private Map<String,String> content;
	private String status;
	private Timestamp readTime;
	private Image image;
	private Integer ImageOwnerid;
	public static final String READ_STATUS = "read";
	public static final String SENT_STATUS = "sent";
	public static final String UNSENT_STATUS = "unsent";
	public static final String REPLY_TYPE = "reply";
	// Constructors

	/** default constructor */
	public Message() {
	//	this.content = new HashMap();
	//	this.content.put("status", "unsend");
		this.status=Message.UNSENT_STATUS;
	}

	/** full constructor */
	public Message(String messageType, Integer userId, User friend
			, Timestamp createTime) {
		this.messageType = messageType;
		this.userId = userId;
		this.friend = friend;
		this.createTime = createTime;
	//	this.content.put("status", "unsend");
		this.status=Message.UNSENT_STATUS;
	}

	// Property accessors

	public String getContent() {
		return content;
	}

	@XmlTransient
	public Image getImage() {
		return image;
	}
	
	
	public Integer getImageOwnerid() {
		if (this.image != null) {
			return this.image.getUserId();
		}
		return null;
	}

	public void setImageOwnerid(Integer imageOwnerid) {
		ImageOwnerid = imageOwnerid;
	}

	public Integer getImageId() {
		if (this.image != null) {
			return this.image.getImageId();
		}
		return null;
	}

	public void setImageId(Integer imageId) {
		ImageId = imageId;
	}

	public void setImage(Image image) {
		this.image = image;
	}

	public void setContent(String content) {
		this.content = content;
	}

	
	@XmlTransient
	public Timestamp getReadTime(){
		return this.readTime;
	}
	
	public void setReadTime(Timestamp readTime){
		this.readTime=readTime;
	}
	
	@XmlTransient
	public String getStatus(){
	//	if (this.content.containsKey("status")){
	//		return this.content.get("status");
	//	}
	//	return null;
		return this.status;
	}

	
	public void setStatus(String status){
	//	this.content.put("status", status);
		this.status=status;
	}
	
//	@XmlTransient
//	public Map<String,String> getContent(){
//		return this.content;
//	}
	
	public Integer getMessageId() {
		return this.messageId;
	}

	public void setMessageId(Integer messageId) {
		this.messageId = messageId;
	}

	public String getMessageType() {
		return this.messageType;
	}

	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}

	public Integer getUserId() {
		return this.userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	
//	@XmlTransient
	public User getFriend() {
		return this.friend;
	}

	public void setFriend(User friend) {
		this.friend=friend;
	}
	
	@XmlTransient
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}