// JavaScript for PAPER PACKAGING HUB Website

// Import Bootstrap
const bootstrap = window.bootstrap

// Contact Modal Functions
function openContactModal() {
  const modal = new bootstrap.Modal(document.getElementById("contactModal"))
  modal.show()
}

// Handle Contact Form Submission with PHP
async function handleContactSubmit(event) {
  event.preventDefault()

  const form = event.target
  const submitButton = form.querySelector('button[type="submit"]')
  const originalButtonText = submitButton.innerHTML

  // Hide previous alerts
  const successAlert = document.getElementById('modalSuccessAlert')
  const errorAlert = document.getElementById('modalErrorAlert')
  if (successAlert) successAlert.style.display = 'none'
  if (errorAlert) errorAlert.style.display = 'none'

  // Show loading state
  submitButton.disabled = true
  submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...'

  try {
    const formData = new FormData(form)

    const response = await fetch('contact.php', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (data.success) {
      // Show success message
      if (successAlert) {
        document.getElementById('modalSuccessMessage').textContent = data.message
        successAlert.style.display = 'block'
      }

      // Reset form
      form.reset()

      // Close modal after 2 seconds
      setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'))
        modal.hide()
      }, 2000)
    } else {
      // Handle validation errors
      if (data.errors && Object.keys(data.errors).length > 0) {
        Object.keys(data.errors).forEach(fieldId => {
          const errorElement = document.getElementById('modal' + fieldId.charAt(0).toUpperCase() + fieldId.slice(1) + 'Error')
          const field = document.getElementById('modal' + fieldId.charAt(0).toUpperCase() + fieldId.slice(1))
          if (errorElement) {
            errorElement.textContent = data.errors[fieldId]
          }
          if (field) {
            field.classList.add('is-invalid')
          }
        })
      } else {
        if (errorAlert) {
          document.getElementById('modalErrorMessage').textContent = data.message || 'An error occurred. Please try again.'
          errorAlert.style.display = 'block'
        }
      }
    }
  } catch (error) {
    console.error('Error:', error)
    if (errorAlert) {
      document.getElementById('modalErrorMessage').textContent = 'Network error. Please try again.'
      errorAlert.style.display = 'block'
    }
  } finally {
    // Restore button state
    submitButton.disabled = false
    submitButton.innerHTML = originalButtonText
  }
}

// Clear error messages when user starts typing
document.addEventListener('input', function (e) {
  if (e.target.id && e.target.id.startsWith('modal')) {
    const fieldId = e.target.id
    const errorElement = document.getElementById(fieldId + 'Error')
    if (errorElement) {
      errorElement.textContent = ''
      e.target.classList.remove('is-invalid')
    }
  }
})

// Auto-start carousel
document.addEventListener("DOMContentLoaded", () => {
  // Initialize carousel with auto-play
  const heroCarousel = document.getElementById("heroCarousel")
  if (heroCarousel) {
    const carousel = new bootstrap.Carousel(heroCarousel, {
      interval: 5000,
      ride: "carousel",
    })
  }

  // Add animation to elements when they come into view
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in-up")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe all cards and sections
  document.querySelectorAll(".card, .stat-item, .product-icon").forEach((el) => {
    observer.observe(el)
  })

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href !== "#" && document.querySelector(href)) {
        e.preventDefault()
        document.querySelector(href).scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })

  // Add active state to navigation based on current page
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  document.querySelectorAll(".nav-link").forEach((link) => {
    const linkPage = link.getAttribute("href")
    if (linkPage === currentPage) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })
})

// Add scroll effect to navbar with animation
let lastScroll = 0
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  const currentScroll = window.pageYOffset

  if (currentScroll > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }

  lastScroll = currentScroll
})

// Initialize navbar state on page load
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar")
  const currentScroll = window.pageYOffset

  if (currentScroll > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
})
