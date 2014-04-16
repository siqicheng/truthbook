package imageUpload;

import java.io.File;
import java.text.SimpleDateFormat;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.List;
import java.util.Date;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.ProgressListener;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

public class imageUploadServlet extends HttpServlet {
	
	
	public void doPost(HttpServletRequest request , HttpServletResponse response) 
		throws ServletException , IOException{
		
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		
		PrintWriter out=response.getWriter();
		
		FileItemFactory factory = new DiskFileItemFactory(); 
		ServletFileUpload upload = new ServletFileUpload(factory); 
		upload.setProgressListener(new ImageUploadProgressListener(request));
		
		List<FileItem> items = null;
		try{
			items = upload.parseRequest(request);
		}catch (FileUploadException e){
			e.printStackTrace();
		}
		
		String path = "" ;
		String fileName = "";
		String userName = "";
		String receiverName = "";
		Integer userId = null;
		Integer receiverId = null;
		
		InputStream is = null;
		for (FileItem item : items){
			if (item.isFormField()){
				if (item.getFieldName().equals("userid")){
					userId = Integer.parseInt(item.getString("UTF-8"));
				}
				
				else if (item.getFieldName().equals("receiverid")){
					receiverId = Integer.parseInt(item.getString("UTF-8"));
				}
				
				else if (item.getFieldName().equals("username")){
					userName = item.getString("UTF-8");
				}
				
				else if (item.getFieldName().equals("receivername")){
					receiverName = item.getString("UTF-8");
				}
			}
			
			else if (item.getName().trim() != null && !item.getName().trim().equals("")){
				path = item.getName();
				
				if (File.separatorChar == '/'){
					path.replace('\\', '/');
				}
				
				fileName = path.substring(path.lastIndexOf(File.separatorChar)+1);
				is = item.getInputStream();
			}
		}
		
		
		StringBuffer fileNameBuffer =new StringBuffer();
		fileNameBuffer.append(this.getServletContext().getRealPath("/"));
		fileNameBuffer.append("Uploaded");
		
		File filePath=new File(fileNameBuffer.toString());
		if (!filePath.exists() && !filePath.isDirectory()){
			filePath.mkdir();
		}
		
		fileNameBuffer.append(File.separator);
		fileNameBuffer.append(userName+"_to_"+receiverName+"_at_");
		fileNameBuffer.append( (new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date()) ));
		if (fileName.lastIndexOf('.')>-1){
			
			fileNameBuffer.append(fileName.substring(fileName.lastIndexOf('.')));
		}
		
		fileName = fileNameBuffer.toString();
		
		FileOutputStream os = new FileOutputStream(fileName);
		byte[] buffer = new byte[8192];
		
		int count = 0;
		while ((count = is.read(buffer)) >0){
			os.write(buffer , 0 , count);
		}
		
		os.close();
		is.close();
		
		out.print("true");
	}
}
