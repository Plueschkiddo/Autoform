package com.plueschkiddo.cordova.plugin;

// Android specific imports
import android.os.Environment;
import android.content.res.AssetManager;
import android.Manifest;


// Cordova-required packages
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PermissionHelper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

// PDF-manipulation-required packages
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

// file-manipulation-required packages
import java.io.File;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.io.InputStream;
import java.io.FileOutputStream;

// make Stacktrace accessible
import java.io.StringWriter;
import java.io.PrintWriter;

// error-handling-required packages
import java.io.IOException;
import java.net.URL; 

public class PDFCreate extends CordovaPlugin {
	
	public static final String WRITE_EXTERNAL_STORAGE = Manifest.permission.WRITE_EXTERNAL_STORAGE;
	public static final int SEARCH_REQ_CODE = 0;

	public boolean execute(String action, JSONArray args,
    final CallbackContext callbackContext) {
		// Verify that the user sent a 'show' action
		if (!action.equals("createpdf")) {
			callbackContext.error("\"" + action + "\" is not a recognized action.");
			return false;
		}
		
		String options1;
		String options2;
      
		try {
			JSONObject options = args.getJSONObject(0);
			options1 = options.getString("op1");
			options2 = options.getString("op2");
		} catch (JSONException e) {
			callbackContext.error("Error encountered: " + e.getMessage());
			return false;
		}
		
		if (PermissionHelper.hasPermission(this, WRITE_EXTERNAL_STORAGE)) {
			saving_a_file(callbackContext);
		} else {
			PermissionHelper.requestPermission(this, SEARCH_REQ_CODE, WRITE_EXTERNAL_STORAGE);
		}
		
		// Send a positive result to the callbackContext
		PluginResult pluginResult = new PluginResult(PluginResult.Status.OK);
		callbackContext.sendPluginResult(pluginResult);
		return true;
	}
	
	public boolean saving_a_file(CallbackContext callbackContext) {
		try {
			AssetManager assetManager = this.cordova.getActivity().getApplicationContext().getAssets();
			InputStream pdfAsset = assetManager.open("www/VorlageGELOS.pdf");
			// PDDocument doc = PDDocument.load(pdfAsset);
			
			String cashback = "Get 2% cashback on all purchases from xyz \n Get 10% cashback on travel from dhhs shop";
			String state = Environment.getExternalStorageState();
			
			//external storage availability check
			if (!Environment.MEDIA_MOUNTED.equals(state)) {
				return false;
			}
			
			File file = new File(Environment.getExternalStoragePublicDirectory(
					Environment.DIRECTORY_DOCUMENTS), "document.pdf");

			file.createNewFile();
			Files.copy(pdfAsset, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
			//second argument of FileOutputStream constructor indicates whether to append or create new file if one exists
			// FileOutputStream outputStream = new FileOutputStream(file, true);
			// IOUtils.copy(pdfAsset, outputStream);

			// outputStream.write(cashback.getBytes());
			// outputStream.flush();
			// outputStream.close();
			// doc.save(file);
			// doc.close();
			return true;
			
        } catch (IOException e) {
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			String sStackTrace = sw.toString(); // stack trace as a string
			callbackContext.error("Error encountered: " + "\n" + sStackTrace);
            return false;
        }
	}
}