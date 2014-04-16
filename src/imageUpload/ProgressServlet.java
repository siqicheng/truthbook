package imageUpload;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class ProgressServlet extends HttpServlet {

	public ProgressServlet() {
		super();
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		try{
			HttpSession session = request.getSession();
		//	UploadStatus status = (UploadStatus) session.getAttribute("status");
		//	double percent = (double)status.getPBytesRead()/ (double)status.getPContentLength();
			String percent = (String) session.getAttribute("percent");
			response.getWriter().write(percent);
		}catch (Exception e){
			e.printStackTrace();
		}
	}

}
