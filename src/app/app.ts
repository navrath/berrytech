import { Component, signal, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, AfterViewInit {
  protected readonly title = signal('BerryTech');
  private config: any = {};

  ngOnInit() {
    this.loadConfig();
  }

  ngAfterViewInit() {
    this.setupEventListeners();
    this.initializeThemeMode();
    console.log('🎯 Angular app initialized - checking theme mode');
    if (this.config && this.config.pricing) {
      this.updatePricing();
      this.updateContactInfo();
    }
  }

  private async loadConfig() {
    try {
      const configUrl = new URL('./config.json', window.location.href).href;
      const response = await fetch(configUrl);
      if (!response.ok) {
        throw new Error(`Config fetch failed with status ${response.status}`);
      }
      this.config = await response.json();
      console.log('Config loaded:', this.config);
    } catch (error) {
      console.error('Error loading config:', error);
      this.config = {
        company: {
          name: 'BerryTech',
          tagline: 'Your trusted partner for software and device support',
          copyright: '© 2026 BerryTech. All rights reserved.'
        },
        contact: {
          email: 'support@berrytech.com',
          phone: '+1 (123) 456-7890',
          whatsapp: '+11234567890',
          supportHours: '24/7 Support Available',
          location: 'Remote Support Worldwide'
        },
        features: ['Certified Technicians', 'Fast Response Time', 'Money-Back Guarantee', 'Secure & Confidential'],
        pricing: {
          usd: {
            basic: { price: 10, period: 'Per Issue', issues: '1 Issue', resolution: '24-48 Hours', features: ['Single Issue Resolution', 'Remote Support', 'Basic Troubleshooting', '30-Day Warranty'] },
            standard: { price: 35, period: 'Per Session', issues: '4-5 Issues', resolution: 'Same Day', features: ['Multiple Issues', 'Priority Support', 'System Optimization', 'Software Installation', '90-Day Warranty'] },
            expert: { price: 75, period: 'Per Month', issues: '10 Issues', resolution: 'Next Business Day', features: ['Advanced Support', 'Virus Removal', 'Network Setup', 'Device Configuration', 'Monthly Maintenance', 'Priority Hotline'] },
            pro_expert: { price: 99, period: 'One-time Lifetime', issues: 'Unlimited', resolution: '24/7 Priority', features: ['Lifetime Unlimited Support', '24/7 Emergency Access', 'Proactive Monitoring', 'Custom Solutions', 'Training Sessions', 'VIP Support Line'] }
          },
          inr: {
            basic: { price: 800, period: 'Per Issue', issues: '1 Issue', resolution: '24-48 Hours', features: ['Single Issue Resolution', 'Remote Support', 'Basic Troubleshooting', '30-Day Warranty'] },
            standard: { price: 2900, period: 'Per Session', issues: '4-5 Issues', resolution: 'Same Day', features: ['Multiple Issues', 'Priority Support', 'System Optimization', 'Software Installation', '90-Day Warranty'] },
            expert: { price: 6200, period: 'Per Month', issues: '10 Issues', resolution: 'Next Business Day', features: ['Advanced Support', 'Virus Removal', 'Network Setup', 'Device Configuration', 'Monthly Maintenance', 'Priority Hotline'] },
            pro_expert: { price: 8200, period: 'One-time Lifetime', issues: 'Unlimited', resolution: '24/7 Priority', features: ['Lifetime Unlimited Support', '24/7 Emergency Access', 'Proactive Monitoring', 'Custom Solutions', 'Training Sessions', 'VIP Support Line'] }
          }
        }
      };
      console.log('Using fallback config:', this.config);
    }

    this.updatePricing();
    this.updateContactInfo();
  }

  private isUSTimezone(): boolean {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Check for US timezones
    const usTimezones = [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Anchorage',
      'Pacific/Honolulu',
      'America/Phoenix',
      'America/Detroit',
      'America/Indiana/Indianapolis',
      'America/Kentucky/Louisville',
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles'
    ];
    return usTimezones.includes(timezone);
  }

  private updatePricing() {
    const isUS = this.isUSTimezone();
    const currency = isUS ? 'usd' : 'inr';
    const currencySymbol = isUS ? '$' : '₹';

    console.log('Updating pricing for currency:', currency, 'isUS:', isUS);

    const plans = ['basic', 'standard', 'expert', 'pro_expert'];

    plans.forEach(plan => {
      const planData = this.config?.pricing?.[currency]?.[plan];
      if (!planData) {
        console.warn(`Missing pricing for plan ${plan} in currency ${currency}`);
        return;
      }
      console.log(`Updating ${plan}:`, planData);

      // Update price
      const priceElement = document.getElementById(`${plan}-price`);
      const currencyElement = document.getElementById(`${plan}-currency`);
      if (priceElement) priceElement.textContent = planData.price.toString();
      if (currencyElement) currencyElement.textContent = currencySymbol;

      // Update period
      const periodElement = document.getElementById(`${plan}-period`);
      if (periodElement) periodElement.textContent = planData.period;

      // Update issues
      const issuesElement = document.getElementById(`${plan}-issues`);
      if (issuesElement) issuesElement.textContent = planData.issues;

      // Update resolution
      const resolutionElement = document.getElementById(`${plan}-resolution`);
      if (resolutionElement) resolutionElement.textContent = planData.resolution;

      // Update features
      const featuresElement = document.getElementById(`${plan}-features`);
      if (featuresElement) {
        featuresElement.innerHTML = planData.features.map((feature: string) =>
          `<li><i class="fas fa-check text-success me-2"></i>${feature}</li>`
        ).join('');
      }
    });
  }

  private updateContactInfo() {
    console.log('Updating contact info with config:', this.config);

    // Update contact information
    const emailElement = document.getElementById('contact-email');
    const phoneElement = document.getElementById('contact-phone');
    const hoursElement = document.getElementById('support-hours');
    const locationElement = document.getElementById('contact-location');
    const featuresListElement = document.getElementById('footer-features-list');

    if (emailElement) emailElement.textContent = this.config.contact.email;
    if (phoneElement) phoneElement.textContent = this.config.contact.phone;
    if (hoursElement) hoursElement.textContent = this.config.contact.supportHours;
    if (locationElement) locationElement.textContent = this.config.contact.location;

    // Update WhatsApp and Email links with device-specific behavior
    this.setupWhatsAppLink();
    this.setupEmailLink();

    // Update footer features list
    if (featuresListElement) {
      featuresListElement.innerHTML = this.config.features.map((feature: string) =>
        `<li><i class="fas fa-check text-success me-2"></i>${feature}</li>`
      ).join('');
    }

    // Update navbar and other elements
    this.updateNavbarAndFooter();
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768 && window.innerHeight <= 1024);
  }

  private isIOSDevice(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  private isAndroidDevice(): boolean {
    return /Android/.test(navigator.userAgent);
  }

  private async checkWhatsAppDesktopInstalled(): Promise<boolean> {
    // Try to open WhatsApp desktop protocol
    return new Promise((resolve) => {
      const testUrl = 'whatsapp://send?phone=1234567890';
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = testUrl;

      const timeout = setTimeout(() => {
        document.body.removeChild(iframe);
        resolve(false); // If timeout, WhatsApp desktop is not installed
      }, 1000);

      iframe.onload = () => {
        clearTimeout(timeout);
        document.body.removeChild(iframe);
        resolve(true); // WhatsApp desktop is installed
      };

      iframe.onerror = () => {
        clearTimeout(timeout);
        document.body.removeChild(iframe);
        resolve(false); // WhatsApp desktop is not installed
      };

      document.body.appendChild(iframe);
    });
  }

  private setupWhatsAppLink() {
    const whatsappLink = document.getElementById('whatsapp-link') as HTMLAnchorElement;
    if (!whatsappLink || !this.config.contact.whatsapp) return;

    const phoneNumber = this.config.contact.whatsapp.replace(/\D/g, '');
    const defaultMessage = encodeURIComponent('Hi, I need technical support for my computer. Can you help me?');

    whatsappLink.onclick = async (e) => {
      e.preventDefault();

      if (this.isMobileDevice()) {
        // Mobile: Open WhatsApp app
        let whatsappUrl: string;

        if (this.isIOSDevice()) {
          // iOS WhatsApp URL scheme
          whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${defaultMessage}`;
        } else if (this.isAndroidDevice()) {
          // Android WhatsApp URL scheme
          whatsappUrl = `intent://send/${phoneNumber}#Intent;scheme=smsto;package=com.whatsapp;action=android.intent.action.SENDTO;end`;
          // Fallback to web WhatsApp
          setTimeout(() => {
            window.open(`https://wa.me/${phoneNumber}?text=${defaultMessage}`, '_blank');
          }, 1000);
        } else {
          // Other mobile devices
          whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${defaultMessage}`;
        }

        window.location.href = whatsappUrl;

        // Fallback to web WhatsApp after 2 seconds if app doesn't open
        setTimeout(() => {
          window.open(`https://wa.me/${phoneNumber}?text=${defaultMessage}`, '_blank');
        }, 2000);

      } else {
        // Desktop: Check if WhatsApp desktop is installed
        const isDesktopInstalled = await this.checkWhatsAppDesktopInstalled();

        if (isDesktopInstalled) {
          // Open WhatsApp desktop app
          window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${defaultMessage}`;
        } else {
          // Open WhatsApp web
          window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${defaultMessage}`, '_blank');
        }
      }
    };

    // Set fallback href for browsers that don't support onclick
    whatsappLink.href = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;
    console.log('WhatsApp link configured for:', this.isMobileDevice() ? 'mobile' : 'desktop');

    const floatingWhatsApp = document.getElementById('floating-whatsapp-button') as HTMLAnchorElement;
    if (floatingWhatsApp) {
      floatingWhatsApp.onclick = whatsappLink.onclick;
      floatingWhatsApp.href = whatsappLink.href;
      floatingWhatsApp.target = '_blank';
      floatingWhatsApp.rel = 'noopener noreferrer';
    }

    const footerWhatsApp = document.getElementById('footer-whatsapp-link') as HTMLAnchorElement;
    if (footerWhatsApp) {
      footerWhatsApp.onclick = whatsappLink.onclick;
      footerWhatsApp.href = whatsappLink.href;
      footerWhatsApp.target = '_blank';
      footerWhatsApp.rel = 'noopener noreferrer';
    }

    // Update mode indicator
    const modeElement = document.getElementById('whatsapp-mode');
    if (modeElement) {
      modeElement.textContent = this.isMobileDevice() ? 'Mobile App' : 'Desktop/Web';
    }
  }

  private setupEmailLink() {
    const emailLink = document.getElementById('email-link') as HTMLAnchorElement;
    if (!emailLink || !this.config.contact.email) return;

    const floatingEmail = document.getElementById('floating-email-button') as HTMLAnchorElement;

    const subject = encodeURIComponent('Technical Support Request');
    const body = encodeURIComponent(`Hi BerryTech Team,

I need technical support for my computer/device. Please help me resolve the following issue:

[Please describe your issue here]

Best regards,
[Your Name]
[Your Contact Number]
[Your Location]`);

    emailLink.onclick = (e) => {
      e.preventDefault();

      if (this.isMobileDevice()) {
        // Mobile: Try to open native email apps
        let emailUrl: string;

        if (this.isIOSDevice()) {
          // iOS: Try Mail app first, then Gmail
          emailUrl = `mailto:${this.config.contact.email}?subject=${subject}&body=${body}`;
          window.location.href = emailUrl;

          // Fallback to Gmail app after 1 second
          setTimeout(() => {
            window.location.href = `googlegmail://co?to=${this.config.contact.email}&subject=${subject}&body=${body}`;
          }, 1000);
        } else if (this.isAndroidDevice()) {
          // Android: Try Gmail app first, then generic mailto
          emailUrl = `intent://compose?to=${this.config.contact.email}&subject=${subject}&body=${body}#Intent;scheme=googlegmail;package=com.google.android.gm;end`;

          // Fallback to generic mailto
          setTimeout(() => {
            window.location.href = `mailto:${this.config.contact.email}?subject=${subject}&body=${body}`;
          }, 1000);
        } else {
          // Other mobile devices
          emailUrl = `mailto:${this.config.contact.email}?subject=${subject}&body=${body}`;
        }

        window.location.href = emailUrl;

      } else {
        // Desktop: Try Gmail web first, then Outlook, then generic mailto
        const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${this.config.contact.email}&su=${subject}&body=${body}`;

        // Check if Gmail is likely available (user might be logged in)
        window.open(gmailUrl, '_blank');

        // Fallback to Outlook web after 2 seconds if Gmail doesn't work
        setTimeout(() => {
          if (!document.hasFocus()) { // If Gmail window lost focus, try Outlook
            window.open(`https://outlook.live.com/mail/0/deeplink/compose?to=${this.config.contact.email}&subject=${subject}&body=${body}`, '_blank');
          }
        }, 2000);
      }
    };

    // Set fallback href
    emailLink.href = `mailto:${this.config.contact.email}?subject=${subject}&body=${body}`;
    if (floatingEmail) {
      floatingEmail.onclick = emailLink.onclick;
      floatingEmail.href = emailLink.href;
      floatingEmail.target = emailLink.target;
      floatingEmail.rel = emailLink.rel;
    }

    const footerEmail = document.getElementById('footer-email-link') as HTMLAnchorElement;
    if (footerEmail) {
      footerEmail.onclick = emailLink.onclick;
      footerEmail.href = emailLink.href;
      footerEmail.target = emailLink.target;
      footerEmail.rel = emailLink.rel;
    }
    console.log('Email link configured for:', this.isMobileDevice() ? 'mobile' : 'desktop');

    // Update mode indicator
    const modeElement = document.getElementById('email-mode');
    if (modeElement) {
      modeElement.textContent = this.isMobileDevice() ? 'Mobile Mail' : 'Web Mail';
    }
  }

  private updateNavbarAndFooter() {
    const navbarBrand = document.getElementById('navbar-brand-name');
    const heroCompany = document.getElementById('hero-company-name');
    const aboutCompany = document.getElementById('about-company-name');
    const footerCopyright = document.getElementById('footer-copyright');
    const footerTagline = document.getElementById('footer-tagline');

    if (navbarBrand) navbarBrand.textContent = this.config.company.name;
    if (heroCompany) heroCompany.textContent = this.config.company.name;
    if (aboutCompany) aboutCompany.textContent = this.config.company.name;
    if (footerCopyright) footerCopyright.textContent = this.config.company.copyright;
    if (footerTagline) footerTagline.textContent = this.config.company.tagline;
  }

  private setupEventListeners() {
    // Form submission handler
    const contactForm = document.getElementById('contactForm') as HTMLFormElement;
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmission();
      });
    }

    // Review submission handler
    const reviewForm = document.getElementById('reviewForm') as HTMLFormElement;
    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleReviewSubmission();
      });
    }

    // Smooth scrolling for navbar links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector((e.target as HTMLAnchorElement).getAttribute('href')!);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Plan button auto-selection and message draft
    this.setupPlanSelection();
    this.setupMobileNavbar();

    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('bg-dark');
          navbar.classList.remove('bg-transparent');
        } else {
          navbar.classList.add('bg-transparent');
          navbar.classList.remove('bg-dark');
        }
      }
    });
  }

  private setupPlanSelection() {
    document.querySelectorAll<HTMLAnchorElement>('.select-plan').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        const planName = button.dataset['plan'] || 'selected plan';
        const issueValue = button.dataset['issue'] || 'software';
        const draftMessage = button.dataset['message']
          ? decodeURIComponent(button.dataset['message']!)
          : `Hi BerryTech,\n\nI am interested in the ${planName}. Please contact me with the next steps for this support package.\n\nThank you.`;

        const issueInput = document.getElementById('issue') as HTMLSelectElement;
        const messageInput = document.getElementById('message') as HTMLTextAreaElement;

        if (issueInput) {
          const optionExists = Array.from(issueInput.options).some(option => option.value === issueValue);
          issueInput.value = optionExists ? issueValue : 'other';
        }

        if (messageInput) {
          messageInput.value = draftMessage;
        }

        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setTimeout(() => {
          messageInput?.focus();
        }, 350);
      });
    });
  }

  private setupMobileNavbar() {
    const toggler = document.querySelector('.navbar-toggler') as HTMLButtonElement | null;
    const collapseEl = document.getElementById('navbarNav');
    if (!toggler || !collapseEl) return;

    const closeMenu = () => {
      const bootstrap = (window as any).bootstrap;
      if (!bootstrap?.Collapse) return;
      const instance = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
      instance.hide();
    };

    document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && collapseEl.classList.contains('show')) {
        closeMenu();
      }
    });

    document.addEventListener('click', (event) => {
      if (window.innerWidth > 768 || !collapseEl.classList.contains('show')) return;
      const target = event.target as Node;
      const clickedInsideMenu = collapseEl.contains(target);
      const clickedToggler = toggler.contains(target);
      if (!clickedInsideMenu && !clickedToggler) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && collapseEl.classList.contains('show')) {
        closeMenu();
      }
    });
  }

  private initializeThemeMode() {
    console.log('Initializing theme mode...');
    const storedMode = localStorage.getItem('berryTechMode') || 'berry'; // Changed default to berry
    console.log('Stored mode:', storedMode);
    this.applyThemeMode(storedMode);
    this.setupThemeButtons();
  }

  private setupThemeButtons() {
    console.log('Setting up theme buttons...');
    const simpleButton = document.getElementById('simple-mode-btn');
    const berryButton = document.getElementById('berry-mode-btn');
    console.log('Simple button found:', !!simpleButton);
    console.log('Berry button found:', !!berryButton);

    if (simpleButton) {
      simpleButton.addEventListener('click', () => {
        console.log('Simple mode button clicked');
        this.applyThemeMode('simple');
      });
    }

    if (berryButton) {
      berryButton.addEventListener('click', () => {
        console.log('Berry mode button clicked');
        alert('Berry Mode Clicked!'); // TEMPORARY: Alert to test if button works
        this.applyThemeMode('berry');
      });
    }
  }

  private applyThemeMode(mode: string) {
    console.log('Applying theme mode:', mode);
    const body = document.body;
    body.classList.remove('simple-mode', 'berry-mode');
    if (mode === 'berry') {
      body.classList.add('berry-mode');
    } else {
      body.classList.add('simple-mode');
    }
    localStorage.setItem('berryTechMode', mode);
    console.log('Body classes after theme change:', body.className);
    console.log('Body element:', body);
    console.log('Computed background:', getComputedStyle(body).background);

    const simpleButton = document.getElementById('simple-mode-btn');
    const berryButton = document.getElementById('berry-mode-btn');

    if (simpleButton && berryButton) {
      simpleButton.classList.toggle('active', mode === 'simple');
      berryButton.classList.toggle('active', mode === 'berry');
      console.log('Button states updated');
    }
  }

  private handleFormSubmission() {
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const phoneInput = document.getElementById('phone') as HTMLInputElement;
    const issueInput = document.getElementById('issue') as HTMLSelectElement;
    const messageInput = document.getElementById('message') as HTMLTextAreaElement;

    const name = nameInput?.value;
    const email = emailInput?.value;
    const phone = phoneInput?.value;
    const issue = issueInput?.value;
    const message = messageInput?.value;

    if (!name || !email || !issue || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    const issueText = issueInput?.options?.[issueInput.selectedIndex]?.text || issue;
    const subject = encodeURIComponent(`Support Request - ${issueText}`);
    const bodyContent = `Hello BerryTech Team,\n\n` +
      `I need support with the following issue:\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || 'Not provided'}\n` +
      `Issue Type: ${issueText}\n\n` +
      `Issue Details:\n${message}\n\n` +
      `Thank you.`;
    const body = encodeURIComponent(bodyContent);

    this.sendEmail(subject, body);
    alert('Your email draft is ready. Please click Send in your email app.');

    const form = document.getElementById('contactForm') as HTMLFormElement;
    form?.reset();
  }

  private handleReviewSubmission() {
    const nameInput = document.getElementById('review-name') as HTMLInputElement;
    const emailInput = document.getElementById('review-email') as HTMLInputElement;
    const ratingInput = document.getElementById('review-rating') as HTMLSelectElement;
    const commentsInput = document.getElementById('review-comments') as HTMLTextAreaElement;

    const name = nameInput?.value || 'Anonymous';
    const email = emailInput?.value || 'Not provided';
    const rating = ratingInput?.value;
    const comments = commentsInput?.value;

    if (!rating || !comments) {
      alert('Please select a rating and add your comments before sending your review.');
      return;
    }

    const subject = encodeURIComponent('Customer Review for BerryTech');
    const bodyContent = `Hello BerryTech Team,\n\n` +
      `Please find a new customer review below:\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Rating: ${rating} star(s)\n\n` +
      `Comments:\n${comments}\n\n` +
      `Thank you for reviewing our service!`;
    const body = encodeURIComponent(bodyContent);

    this.sendEmail(subject, body);

    const reviewForm = document.getElementById('reviewForm') as HTMLFormElement;
    reviewForm?.reset();
  }

  private sendEmail(subject: string, body: string) {
    const emailAddress = this.config?.contact?.email || 'support@berrytech.com';
    const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;

    if (this.isMobileDevice()) {
      if (this.isIOSDevice()) {
        // iOS order: Gmail app -> Outlook app -> Apple Mail/default mail app.
        window.location.href = `googlegmail://co?to=${emailAddress}&subject=${subject}&body=${body}`;
        setTimeout(() => {
          window.location.href = `ms-outlook://compose?to=${emailAddress}&subject=${subject}&body=${body}`;
        }, 700);
        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 1400);
        return;
      }

      if (this.isAndroidDevice()) {
        // Android order: Gmail app -> Outlook app -> default mail app.
        window.location.href = `intent://compose?to=${emailAddress}&subject=${subject}&body=${body}#Intent;scheme=googlegmail;package=com.google.android.gm;end`;
        setTimeout(() => {
          window.location.href = `intent://compose?to=${emailAddress}&subject=${subject}&body=${body}#Intent;scheme=ms-outlook;package=com.microsoft.office.outlook;end`;
        }, 700);
        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 1400);
        return;
      }
    }

    // Desktop/non-mobile order: default mail app (Outlook/Apple Mail/etc.) -> Gmail web fallback.
    window.location.href = mailtoUrl;
    setTimeout(() => {
      const gmailWebCompose = `https://mail.google.com/mail/?view=cm&to=${emailAddress}&su=${subject}&body=${body}`;
      window.open(gmailWebCompose, '_blank');
    }, 900);
  }

  private setFallbackContact() {
    // Fallback contact information
    const fallbackConfig = {
      company: {
        name: 'BerryTech',
        tagline: 'Your trusted partner for software and device support',
        copyright: '© 2026 BerryTech. All rights reserved.'
      },
      contact: {
        email: 'support@berrytech.com',
        phone: '+1 (123) 456-7890',
        supportHours: '24/7 Support Available',
        location: 'Remote Support Worldwide',
        whatsapp: '+11234567890'
      },
      features: [
        'Certified Technicians',
        'Fast Response Time',
        'Money-Back Guarantee',
        'Secure & Confidential'
      ]
    };

    this.config = fallbackConfig;
    console.log('Using fallback config:', this.config);
    this.updateContactInfo();
  }
}
