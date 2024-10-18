import { Component } from '@angular/core';
import { WebView, Http } from '@nativescript/core';

@Component({
  selector: 'ns-screenshot',
  templateUrl: './screenshot.component.html',
  styleUrls: ['./screenshot.component.css']
})
export class ScreenshotComponent {
  url: string = '';
  isMobileView: boolean = true;
  isWebViewMode: boolean = true;
  links: string[] = [];
  isLoading: boolean = false;
  screenshotPath: string = '';

  async onUrlSubmit() {
    this.isLoading = true;
    this.links = [];
    this.screenshotPath = '';

    try {
      const response = await Http.request({
        url: 'http://10.0.2.2:3000/screenshot', // Use 10.0.2.2 for Android emulator to access localhost
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({
          targetUrl: this.url,
          viewMode: this.isMobileView ? 'mobile' : 'desktop'
        })
      });

      const result = response.content.toJSON();
      this.links = result.links;
      this.screenshotPath = result.screenshotPath;

      const webView = this.getWebView();
      if (webView) {
        webView.src = this.url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the request.');
    } finally {
      this.isLoading = false;
    }
  }

  toggleView() {
    this.isMobileView = !this.isMobileView;
    const webView = this.getWebView();
    if (webView) {
      webView.reload();
    }
  }

  toggleScreenshotMode() {
    this.isWebViewMode = !this.isWebViewMode;
  }

  private getWebView(): WebView | null {
    return this.isMobileView
      ? this.getMobileWebView()
      : this.getDesktopWebView();
  }

  private getMobileWebView(): WebView | null {
    return this.getWebViewById('mobileWebView');
  }

  private getDesktopWebView(): WebView | null {
    return this.getWebViewById('desktopWebView');
  }

  private getWebViewById(id: string): WebView | null {
    const view = this.page.getViewById(id);
    return view instanceof WebView ? view : null;
  }
}