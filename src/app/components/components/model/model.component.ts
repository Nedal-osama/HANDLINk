import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModelService } from '../../../service/model.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit {
  imageSrc: string | ArrayBuffer | null = null;
  recognizedText: string | null = null;
  isLoading: boolean = false;
  selectedFile: File | null = null;

  userEmail: string = '';

  history: Array<{
    imagePath: string;
    result: string;
    confidence: string;
    predictTime: string;
  }> = [];

  displayedHistory: Array<{
    imagePath: string;
    result: string;
    confidence: string;
    predictTime: string;
  }> = [];

  showAll: boolean = false;

  constructor(
    private predictionService: ModelService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.decodeUser();
    this.userEmail = this.authService.userInfo?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '';

    if (this.userEmail) {
      this.loadHistory();
    }
  }

  loadHistory(): void {
    this.predictionService.getUserPredictions(this.userEmail).subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.history = response.data;
          this.updateDisplayedHistory();
        }
      },
      error: () => {
        this.history = [];
        this.updateDisplayedHistory();
      }
    });
  }

  updateDisplayedHistory(): void {
    const sortedHistory = [...this.history].sort((a, b) => {
      return new Date(b.predictTime).getTime() - new Date(a.predictTime).getTime();
    });

    if (this.showAll) {
      this.displayedHistory = sortedHistory;
    } else {
      this.displayedHistory = sortedHistory.slice(0, 3);
    }
  }

  toggleSeeMore(event: Event): void {
    event.preventDefault();
    this.showAll = !this.showAll;
    this.updateDisplayedHistory();
  }

  deleteHistoryItem(index: number): void {
    const itemToDelete = this.displayedHistory[index];
    const originalIndex = this.history.findIndex(h => h === itemToDelete);
    if (originalIndex > -1) {
      this.history.splice(originalIndex, 1);
      this.updateDisplayedHistory();
    }
  }

  onFileDropped(event: any): void {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      this.selectedFile = file;
      this.loadImagePreview(file);
      this.recognizedText = null;
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.loadImagePreview(file);
      this.recognizedText = null;
    }
  }

  loadImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onDragOver(event: any): void {
    event.preventDefault();
  }

  runModel(): void {
    if (!this.selectedFile) {
      this.recognizedText = 'Please select a valid image.';
      return;
    }
    if (!this.userEmail) {
      this.recognizedText = 'User email not found. Please login again.';
      return;
    }

    this.isLoading = true;
    this.predictionService.predictImage(this.selectedFile, this.userEmail).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.predicted_label) {
          this.recognizedText = `Label: ${response.predicted_label}`;
          this.loadHistory();
        } else {
          this.recognizedText = 'No text recognized.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.recognizedText = 'An error occurred during recognition.';
      }
    });
  }

  removeImage(): void {
    this.imageSrc = null;
    this.recognizedText = null;
    this.selectedFile = null;
  }

  speakText(): void {
    if (this.recognizedText) {
      const speech = new SpeechSynthesisUtterance(this.recognizedText);
      speech.lang = 'en-US';
      speech.rate = 1;
      speech.pitch = 1;
      speechSynthesis.speak(speech);
    }
  }
}
