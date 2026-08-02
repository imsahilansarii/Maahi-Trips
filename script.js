// ---- Hotel photo slider (multiple photos per hotel card) ----
  document.querySelectorAll('.hotel-slider, .taxi-slider').forEach(function(slider){
    var wrap = slider.closest('.hotel-img-wrap, .taxi-img-wrap');

    // "View full photo" button — shown on every hotel card, even single-photo ones
    var zoomBtn = document.createElement('button');
    zoomBtn.className = 'hotel-zoom-btn';
    zoomBtn.setAttribute('aria-label', 'View full photo');
    zoomBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/></svg>';
    zoomBtn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      openLightbox(slider);
    });
    wrap.appendChild(zoomBtn);

    var slides = slider.querySelectorAll('.hotel-slide, .taxi-slide');
    if (slides.length <= 1) return;
    var current = 0;

    var dotsContainer = document.createElement('div');
    dotsContainer.className = 'hotel-slide-dots';
    slides.forEach(function(_, i){
      var dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    });
    wrap.appendChild(dotsContainer);
    var dots = dotsContainer.querySelectorAll('span');

    function show(i){
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    var prevBtn = document.createElement('button');
    prevBtn.className = 'hotel-slide-prev';
    prevBtn.setAttribute('aria-label', 'Previous photo');
    prevBtn.innerHTML = '&#8249;';
    var nextBtn = document.createElement('button');
    nextBtn.className = 'hotel-slide-next';
    nextBtn.setAttribute('aria-label', 'Next photo');
    nextBtn.innerHTML = '&#8250;';
    wrap.appendChild(prevBtn);
    wrap.appendChild(nextBtn);

    prevBtn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); show(current - 1); });
    nextBtn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); show(current + 1); });

    var startX = null;
    slider.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; });
    slider.addEventListener('touchend', function(e){
      if (startX === null) return;
      var diff = e.changedTouches[0].clientX - startX;
      if (diff > 40) show(current - 1);
      else if (diff < -40) show(current + 1);
      startX = null;
    });
  });

  // ---- Mobile hamburger menu ----
  (function(){
    var menuToggle = document.querySelector('.menu-toggle');
    var navlinks = document.querySelector('.navlinks');
    if (!menuToggle || !navlinks) return;
    menuToggle.addEventListener('click', function(){
      navlinks.classList.toggle('mobile-open');
    });
    // Close the menu after tapping any link
    navlinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        navlinks.classList.remove('mobile-open');
      });
    });
    // Close the menu if tapping outside it
    document.addEventListener('click', function(e){
      if (!navlinks.contains(e.target) && !menuToggle.contains(e.target)){
        navlinks.classList.remove('mobile-open');
      }
    });
  })();

  function openLightbox(el){
    var img = el.querySelector('img.active') || el.querySelector('img');
    var src = img.getAttribute('src');
    document.getElementById('lightbox-img').setAttribute('src', src);
    document.getElementById('lightbox').classList.add('open');
  }
  function closeLightbox(e){
    document.getElementById('lightbox').classList.remove('open');
  }

  /* ============================================================
     ENQUIRY FORM — EmailJS INTEGRATION
     ------------------------------------------------------------
     1) Create a free account at https://www.emailjs.com
     2) Add an Email Service (e.g. Gmail) connected to
        maahitripss@gmail.com — copy its SERVICE ID.
     3) Create an Email Template with these variables in the body:
        {{from_name}} {{from_phone}} {{from_email}} {{interested_in}} {{message}}
        — copy its TEMPLATE ID.
     4) Copy your PUBLIC KEY from Account > API Keys.
     5) Paste all three values into the placeholders below.
     ============================================================ */
  var EMAILJS_PUBLIC_KEY  = "Poz5-bocFNXq0nU7Y";
  var EMAILJS_SERVICE_ID  = "service_5q2wd1b";
  var EMAILJS_TEMPLATE_ID = "template_o6tumw9";

  /* ============================================================
     IMAGE HOSTING FOR HOTEL PHOTOS (List Your Hotel form)
     A static site (GitHub Pages) can't store uploaded files itself,
     so photos the hotel owner selects are uploaded to ImgBB (free
     image host) and the resulting links are emailed to you for review.
     To enable this:
     1) Go to https://api.imgbb.com/ and sign up (free).
     2) Copy your API key from that page.
     3) Paste it below, replacing "YOUR_IMGBB_API_KEY".
     Until you do this, photo uploads will show an error asking the
     owner to try later — the rest of the form still works fine.
     ============================================================ */
  var IMGBB_API_KEY = "9d966c8d6a68e82ff3088ab7b36d049c";

  // Initialise EmailJS once the SDK has loaded
  if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  var enquiryForm   = document.getElementById('enquiry-form');
  var submitBtn     = document.getElementById('ef-submit-btn');
  var submitLabel   = document.getElementById('ef-submit-label');
  var statusBox     = document.getElementById('ef-status');

  // Clears all field-error states and the status banner
  function resetFormErrors(){
    ['fg-name','fg-phone','fg-email','fg-message'].forEach(function(id){
      document.getElementById(id).classList.remove('field-error');
    });
    statusBox.className = 'form-status';
    statusBox.textContent = '';
  }

  // Validates required fields; returns true if the form is valid
  function validateEnquiryForm(){
    var isValid = true;
    var name    = document.getElementById('ef-name').value.trim();
    var phone   = document.getElementById('ef-phone').value.trim();
    var email   = document.getElementById('ef-email').value.trim();
    var message = document.getElementById('ef-message').value.trim();

    var phonePattern = /^[6-9]\d{9}$/;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name){
      document.getElementById('fg-name').classList.add('field-error');
      isValid = false;
    }
    if (!phone || !phonePattern.test(phone)){
      document.getElementById('fg-phone').classList.add('field-error');
      isValid = false;
    }
    if (!email || !emailPattern.test(email)){
      document.getElementById('fg-email').classList.add('field-error');
      isValid = false;
    }
    if (!message){
      document.getElementById('fg-message').classList.add('field-error');
      isValid = false;
    }
    return isValid;
  }

  // Puts the submit button into / out of its loading state
  function setSubmitLoading(isLoading){
    submitBtn.disabled = isLoading;
    if (isLoading){
      submitLabel.innerHTML = '<span class="form-spinner"></span> Sending...';
    } else {
      submitLabel.textContent = 'Submit';
    }
  }

  if (enquiryForm){
    enquiryForm.addEventListener('submit', function(e){
      e.preventDefault();
      resetFormErrors();

      if (!validateEnquiryForm()){
        statusBox.textContent = 'Please fill all required fields correctly.';
        statusBox.className = 'form-status error show';
        return;
      }

      var templateParams = {
        from_name:      document.getElementById('ef-name').value.trim(),
        from_phone:     document.getElementById('ef-phone').value.trim(),
        from_email:     document.getElementById('ef-email').value.trim(),
        interested_in:  document.getElementById('ef-service').value,
        message:        document.getElementById('ef-message').value.trim(),
        to_email:       'maahitripss@gmail.com'
      };

      setSubmitLoading(true);

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(){
          setSubmitLoading(false);
          statusBox.textContent = 'Thank you! Your enquiry has been submitted successfully. We will contact you soon.';
          statusBox.className = 'form-status success show';
          enquiryForm.reset();
        })
        .catch(function(err){
          setSubmitLoading(false);
          statusBox.textContent = 'Something went wrong. Please try again.';
          statusBox.className = 'form-status error show';
          console.error('EmailJS error:', err);
        });
    });
  }

  /* ============================================================
     LIST YOUR HOTEL — owner submission form
     Reuses the same EmailJS service/template as the enquiry form
     above, so no extra EmailJS setup is needed.
     ============================================================ */
  var listHotelForm  = document.getElementById('list-hotel-form');
  var lhSubmitBtn    = document.getElementById('lh-submit-btn');
  var lhSubmitLabel  = document.getElementById('lh-submit-label');
  var lhStatusBox    = document.getElementById('lh-status');

  function resetListHotelErrors(){
    ['lh-fg-owner','lh-fg-phone','lh-fg-email','lh-fg-hotelname','lh-fg-city','lh-fg-desc'].forEach(function(id){
      document.getElementById(id).classList.remove('field-error');
    });
    lhStatusBox.className = 'form-status';
    lhStatusBox.textContent = '';
  }

  function validateListHotelForm(){
    var isValid = true;
    var owner     = document.getElementById('lh-owner').value.trim();
    var phone     = document.getElementById('lh-phone').value.trim();
    var email     = document.getElementById('lh-email').value.trim();
    var hotelName = document.getElementById('lh-hotelname').value.trim();
    var city      = document.getElementById('lh-city').value.trim();
    var desc      = document.getElementById('lh-desc').value.trim();
    var photos    = document.getElementById('lh-photos').files;

    var phonePattern = /^[6-9]\d{9}$/;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!owner){ document.getElementById('lh-fg-owner').classList.add('field-error'); isValid = false; }
    if (!phone || !phonePattern.test(phone)){ document.getElementById('lh-fg-phone').classList.add('field-error'); isValid = false; }
    if (!email || !emailPattern.test(email)){ document.getElementById('lh-fg-email').classList.add('field-error'); isValid = false; }
    if (!hotelName){ document.getElementById('lh-fg-hotelname').classList.add('field-error'); isValid = false; }
    if (!city){ document.getElementById('lh-fg-city').classList.add('field-error'); isValid = false; }
    if (!desc){ document.getElementById('lh-fg-desc').classList.add('field-error'); isValid = false; }
    if (!photos || photos.length === 0){ document.getElementById('lh-fg-photos').classList.add('field-error'); isValid = false; }
    return isValid;
  }

  function setLhSubmitLoading(isLoading, label){
    lhSubmitBtn.disabled = isLoading;
    if (isLoading){
      lhSubmitLabel.innerHTML = '<span class="form-spinner"></span> ' + (label || 'Sending...');
    } else {
      lhSubmitLabel.textContent = 'Submit Listing';
    }
  }

  // Uploads one file to ImgBB and resolves with its hosted URL
  function uploadPhotoToImgbb(file){
    var formData = new FormData();
    formData.append('image', file);
    return fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_API_KEY, {
      method: 'POST',
      body: formData
    })
      .then(function(res){ return res.json(); })
      .then(function(json){
        if (json && json.success && json.data && json.data.url){
          return json.data.url;
        }
        throw new Error('Upload failed for ' + file.name);
      });
  }

  if (listHotelForm){
    listHotelForm.addEventListener('submit', function(e){
      e.preventDefault();
      resetListHotelErrors();

      if (!validateListHotelForm()){
        lhStatusBox.textContent = 'Please fill all required fields and choose at least 1 photo.';
        lhStatusBox.className = 'form-status error show';
        return;
      }

      if (IMGBB_API_KEY === 'YOUR_IMGBB_API_KEY'){
        lhStatusBox.textContent = 'Photo upload isn\'t set up yet on this site — please contact us directly for now.';
        lhStatusBox.className = 'form-status error show';
        return;
      }

      var rooms     = document.getElementById('lh-rooms').value.trim();
      var price     = document.getElementById('lh-price').value.trim();
      var amenities = document.getElementById('lh-amenities').value.trim();
      var hotelName = document.getElementById('lh-hotelname').value.trim();
      var city      = document.getElementById('lh-city').value.trim();
      var desc      = document.getElementById('lh-desc').value.trim();
      var photoFiles = Array.prototype.slice.call(document.getElementById('lh-photos').files);

      setLhSubmitLoading(true, 'Uploading photos...');

      Promise.all(photoFiles.map(uploadPhotoToImgbb))
        .then(function(photoUrls){
          setLhSubmitLoading(true, 'Sending...');

          var detailLines = [
            'New hotel listing submission:',
            'Hotel Name: ' + hotelName,
            'City / Location: ' + city,
            rooms ? 'Rooms: ' + rooms : null,
            price ? 'Price / Night: ₹' + price : null,
            amenities ? 'Amenities: ' + amenities : null,
            'Description: ' + desc,
            'Photos:',
            photoUrls.join('\n')
          ].filter(Boolean).join('\n');

          var templateParams = {
            from_name:      document.getElementById('lh-owner').value.trim(),
            from_phone:     document.getElementById('lh-phone').value.trim(),
            from_email:     document.getElementById('lh-email').value.trim(),
            interested_in:  'Hotel Owner Listing — ' + hotelName,
            message:        detailLines,
            to_email:       'maahitripss@gmail.com'
          };

          return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        })
        .then(function(){
          setLhSubmitLoading(false);
          lhStatusBox.textContent = 'Thank you! Your hotel listing and photos have been submitted. Our team will review and contact you soon.';
          lhStatusBox.className = 'form-status success show';
          listHotelForm.reset();
        })
        .catch(function(err){
          setLhSubmitLoading(false);
          lhStatusBox.textContent = 'Something went wrong. Please try again.';
          lhStatusBox.className = 'form-status error show';
          console.error('EmailJS error:', err);
        });
    });
  }

  /* ============================================================
     LIST YOUR TAXI — owner submission form
     Reuses the same EmailJS service/template as the enquiry form
     above, so no extra EmailJS setup is needed.
     ============================================================ */
  var listTaxiForm  = document.getElementById('list-taxi-form');
  var ltSubmitBtn    = document.getElementById('lt-submit-btn');
  var ltSubmitLabel  = document.getElementById('lt-submit-label');
  var ltStatusBox    = document.getElementById('lt-status');

  function resetListTaxiErrors(){
    ['lt-fg-owner','lt-fg-phone','lt-fg-email','lt-fg-vehiclename','lt-fg-city','lt-fg-desc'].forEach(function(id){
      document.getElementById(id).classList.remove('field-error');
    });
    ltStatusBox.className = 'form-status';
    ltStatusBox.textContent = '';
  }

  function validateListTaxiForm(){
    var isValid = true;
    var owner       = document.getElementById('lt-owner').value.trim();
    var phone       = document.getElementById('lt-phone').value.trim();
    var email       = document.getElementById('lt-email').value.trim();
    var vehicleName = document.getElementById('lt-vehiclename').value.trim();
    var city        = document.getElementById('lt-city').value.trim();
    var desc        = document.getElementById('lt-desc').value.trim();
    var photos      = document.getElementById('lt-photos').files;

    var phonePattern = /^[6-9]\d{9}$/;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!owner){ document.getElementById('lt-fg-owner').classList.add('field-error'); isValid = false; }
    if (!phone || !phonePattern.test(phone)){ document.getElementById('lt-fg-phone').classList.add('field-error'); isValid = false; }
    if (!email || !emailPattern.test(email)){ document.getElementById('lt-fg-email').classList.add('field-error'); isValid = false; }
    if (!vehicleName){ document.getElementById('lt-fg-vehiclename').classList.add('field-error'); isValid = false; }
    if (!city){ document.getElementById('lt-fg-city').classList.add('field-error'); isValid = false; }
    if (!desc){ document.getElementById('lt-fg-desc').classList.add('field-error'); isValid = false; }
    if (!photos || photos.length === 0){ document.getElementById('lt-fg-photos').classList.add('field-error'); isValid = false; }
    return isValid;
  }

  function setLtSubmitLoading(isLoading, label){
    ltSubmitBtn.disabled = isLoading;
    if (isLoading){
      ltSubmitLabel.innerHTML = '<span class="form-spinner"></span> ' + (label || 'Sending...');
    } else {
      ltSubmitLabel.textContent = 'Submit Listing';
    }
  }

  if (listTaxiForm){
    listTaxiForm.addEventListener('submit', function(e){
      e.preventDefault();
      resetListTaxiErrors();

      if (!validateListTaxiForm()){
        ltStatusBox.textContent = 'Please fill all required fields and choose at least 1 photo.';
        ltStatusBox.className = 'form-status error show';
        return;
      }

      if (IMGBB_API_KEY === 'YOUR_IMGBB_API_KEY'){
        ltStatusBox.textContent = 'Photo upload isn\'t set up yet on this site — please contact us directly for now.';
        ltStatusBox.className = 'form-status error show';
        return;
      }

      var vehicleType = document.getElementById('lt-type').value.trim();
      var seats        = document.getElementById('lt-seats').value.trim();
      var price        = document.getElementById('lt-price').value.trim();
      var amenities     = document.getElementById('lt-amenities').value.trim();
      var vehicleName  = document.getElementById('lt-vehiclename').value.trim();
      var city         = document.getElementById('lt-city').value.trim();
      var desc         = document.getElementById('lt-desc').value.trim();
      var photoFiles   = Array.prototype.slice.call(document.getElementById('lt-photos').files);

      setLtSubmitLoading(true, 'Uploading photos...');

      Promise.all(photoFiles.map(uploadPhotoToImgbb))
        .then(function(photoUrls){
          setLtSubmitLoading(true, 'Sending...');

          var detailLines = [
            'New taxi/cab listing submission:',
            'Vehicle Name: ' + vehicleName,
            'City / Base Location: ' + city,
            vehicleType ? 'Vehicle Type: ' + vehicleType : null,
            seats ? 'Seating Capacity: ' + seats : null,
            price ? 'Price / Day: ₹' + price : null,
            amenities ? 'Amenities: ' + amenities : null,
            'Description: ' + desc,
            'Photos:',
            photoUrls.join('\n')
          ].filter(Boolean).join('\n');

          var templateParams = {
            from_name:      document.getElementById('lt-owner').value.trim(),
            from_phone:     document.getElementById('lt-phone').value.trim(),
            from_email:     document.getElementById('lt-email').value.trim(),
            interested_in:  'Taxi Owner Listing — ' + vehicleName,
            message:        detailLines,
            to_email:       'maahitripss@gmail.com'
          };

          return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        })
        .then(function(){
          setLtSubmitLoading(false);
          ltStatusBox.textContent = 'Thank you! Your taxi listing and photos have been submitted. Our team will review and contact you soon.';
          ltStatusBox.className = 'form-status success show';
          listTaxiForm.reset();
        })
        .catch(function(err){
          setLtSubmitLoading(false);
          ltStatusBox.textContent = 'Something went wrong. Please try again.';
          ltStatusBox.className = 'form-status error show';
          console.error('EmailJS error:', err);
        });
    });
  }

  /* ============================================================
     LIVE VISITOR COUNTER / SOCIAL PROOF POPUP
     ------------------------------------------------------------
     Cycles through package names with a randomised "viewed today"
     count to give a sense of live activity. Purely front-end —
     the numbers are illustrative, not pulled from real analytics.
     ============================================================ */
  (function(){
    var packages = [
      'Umrah Packages',
      'Flight Tickets',
      'Hotel Booking',
      'Tour Packages',
      'Visa Assistance',
      'Bus Tickets'
    ];

    var popup      = document.getElementById('socialProof');
    var closeBtn   = document.getElementById('socialProofClose');
    var countEl    = document.getElementById('socialProofCount');
    var packageEl  = document.getElementById('socialProofPackage');

    if (!popup) return;

    var dismissed = sessionStorage.getItem('mt_social_proof_dismissed') === '1';
    if (dismissed) return;

    var cycleIndex = 0;
    var hideTimer, cycleTimer;

    function randomCount(){
      return Math.floor(Math.random() * (34 - 8 + 1)) + 8; // 8–34 viewers
    }

    function showPopup(){
      packageEl.textContent = packages[cycleIndex % packages.length];
      countEl.textContent   = randomCount();
      popup.classList.add('show');

      clearTimeout(hideTimer);
      hideTimer = setTimeout(function(){
        popup.classList.remove('show');
      }, 6000);

      cycleIndex++;
    }

    closeBtn.addEventListener('click', function(){
      popup.classList.remove('show');
      clearTimeout(hideTimer);
      clearInterval(cycleTimer);
      sessionStorage.setItem('mt_social_proof_dismissed', '1');
    });

    // First appearance shortly after load, then repeats periodically
    setTimeout(function(){
      showPopup();
      cycleTimer = setInterval(showPopup, 9000); // hidden 3s, shown 6s between cycles
    }, 3500);
  })();

  function openOfferModal(){
    document.getElementById('offerModalOverlay').classList.add('open');
  }
  function closeOfferModal(){
    document.getElementById('offerModalOverlay').classList.remove('open');
  }
  document.getElementById('offerModalClose').addEventListener('click', closeOfferModal);
  document.getElementById('offerModalOverlay').addEventListener('click', function(e){
    if(e.target === this){ closeOfferModal(); }
  });
  document.getElementById('offersNavLink').addEventListener('click', function(e){
    e.preventDefault();
    openOfferModal();
  });
  // Auto-show the offers popup shortly after the page loads
  window.addEventListener('load', function(){
    setTimeout(openOfferModal, 1200);
  });

