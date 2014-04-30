package fileupload.vo;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.hibernate.Session;
import org.hibernate.Transaction;

import restful.gateway.RestUtil;
import db.mapping.object.Image;
import db.mapping.object.Relationship;
import db.mapping.object.User;
import db.mapping.object.DAO.ImageDAO;
import db.mapping.object.DAO.RelationshipDAO;
import db.mapping.object.DAO.UserDAO;
import fileupload.Uploader;


@JsonIgnoreProperties({"content","receivedrId","userId","is"})
public class FileMeta {
	
	private static final String location = "Uploaded";
	private static final String bucket = "truthbookwinkar.qiniudn.com";

	private String fileName;
	private String fileSize;
	private String fileType;
	private Integer userId;
	private Integer receiverId; 
	private InputStream is;
	private String path;
	private String description;
	
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	private InputStream content;
	
	public String getPath(){
		return this.path;
	}
	
	public void setPath(String path){
		this.path = path;
	}
	
	public void setIs(InputStream is){
		this.is = is;
	}
	
	public InputStream getIs(){
		return this.is;
	}
	
	public Integer getUserId(){
		return this.userId;
	}
	
	public void SetUserId(Integer userId){
		this.userId = userId;
	}
	
	public Integer getReceiverId(){
		return this.receiverId;
	}
	
	public void setReceiverId(Integer receiverId){
		this.receiverId = receiverId;
	}
	
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		UserDAO userdao =  new UserDAO();
		User user = userdao.findById(receiverId);
		User uploader = userdao.findById(userId);
		String ext = (fileName.lastIndexOf('.')>-1)?fileName.substring(fileName.lastIndexOf('.')):"";
		fileName=uploader.getFullName()+"_to_"+user.getFullName()+"_at_"+
				(new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date()))+ext;
		this.fileName = fileName;
	}
	public String getFileSize() {
		return fileSize;
	}
	public void setFileSize(String fileSize) {
		this.fileSize = fileSize;
	}
	public String getFileType() {
		return fileType;
	}
	public void setFileType(String fileType) {
		this.fileType = fileType;
	}
	public InputStream getContent(){
		return this.content;
	}
	public void setContent(InputStream content){
		this.content = content;
	}
	
	@Override
	public String toString() {
		return "FileMeta [fileName=" + fileName + ", fileSize=" + fileSize
				+ ", fileType=" + fileType + "]";
	}
	
	public boolean save(){
		Session session = new ImageDAO().getSession();
		try{
			Transaction tx = session.beginTransaction();
			
			Image image = new Image();
			image.setContent(this.description);
			image.setApproved(false);
			image.setCreateDate(RestUtil.getCurrentDate());
			image.setDeleted(false);
			image.setImageUrl(this.bucket+'/'+fileName);
			image.setLastModified(RestUtil.getCurrentDate());
			image.setUploaderId(userId);
			User receiver = new UserDAO().findById(receiverId);
			image.setUser(receiver);

			Relationship relat = (Relationship)new RelationshipDAO()
					.findByUserAndFriend(receiver, userId);
			
			if (relat.getRelationship() == Relationship.E_FRIEND_LEVEL)
			image.setApproved(true);
			
			session.save(image);
			tx.commit();
			session.close();
			
			return true;
		}catch (Exception e){
			e.printStackTrace();
			session.close();
			return false;
		}
	}
	
	public boolean write(){
		try{
			String RealPath = this.path +File.separator +this.location;
			File filePath=new File(RealPath);
			if (!filePath.exists() || !filePath.isDirectory()){
				filePath.mkdir();
			}
			
			FileOutputStream os = 
					new FileOutputStream(RealPath+File.separator+this.getFileName());
			
			byte[] buffer = new byte[8192];
			
			int count = 0;
			while ((count = is.read(buffer)) >0){
				os.write(buffer , 0 , count);
			}
			
			os.close();
			
			String fullPath =RealPath+ File.separator +this.getFileName();
			Uploader uploader = new Uploader();
			String ret_val = uploader.upload(fileName, fullPath);
			File file = new File(fullPath);
			file.delete();
			
			if (ret_val.indexOf("error")>=0 ) {
				return false;
			}
			return true;
		}catch (Exception e){
			e.printStackTrace();
			return false;
		}
	}
}
