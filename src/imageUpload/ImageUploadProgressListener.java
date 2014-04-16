package imageUpload;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.commons.fileupload.ProgressListener;

public class ImageUploadProgressListener implements ProgressListener {
	private HttpSession session;

	public ImageUploadProgressListener(HttpServletRequest req) {
		session=req.getSession();
		//Cookie[] cookies = req.getCookies();
		//UploadStatus status = new UploadStatus();
		session.setAttribute("percent", "0");
	}

	/* pBytesRead  到目前为止读取文件的比特数
	 * pContentLength 文件总大小
	 * pItems 目前正在读取第几个文件
	 */
	public void update(long pBytesRead, long pContentLength, int pItems) {
	//	UploadStatus status = (UploadStatus) session.getAttribute("status");
	//	status.setPBytesRead(pBytesRead);
	//	status.setPContentLength(pContentLength);
	//	status.setPItems(pItems);
		double percent = (double)pBytesRead / (double) pContentLength;
		session.setAttribute("percent", String.valueOf(percent));
	}

}
