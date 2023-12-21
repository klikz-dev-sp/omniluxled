// Ajax cart JS for Drawer and Cart Page
const drawerSelectors = {
  cartIcons: document.querySelectorAll('.header__icon--cart'),
  cartIconDesktop: document.querySelector('#cart-icon-desktop'),
  cartIconMobile: document.querySelector('#cart-icon-mobile'),
  cartDrawerCount: document.querySelector('[data-drawer-cart-count]'),
}
class AjaxCart extends HTMLElement {
  constructor() {
    super()

    this.openeBy = drawerSelectors.cartIcons
    this.isOpen = this.classList.contains('open--drawer')
    this.bindEvents()
    this.cartNoteInput()
    this.querySelectorAll('.close-ajax--cart').forEach((button) =>
      button.addEventListener('click', this.closeCartDrawer.bind(this))
    )
    document
      .querySelectorAll('[data-gwp-close]')
      .forEach((button) =>
        button.addEventListener('click', this.closePopup.bind(this))
      )
    document
      .querySelectorAll('[add-gwp-product]')
      .forEach((button) =>
        button.addEventListener('click', this.addMultiGWPProduct.bind(this))
      )

    if (window.globalVariables.template != 'cart') {
      this.addAccessibilityAttributes(this.openeBy)
      this.getCartData()
    } else {
      this.style.visibility = 'visible'
    }

    if (navigator.platform === 'iPhone')
      document.documentElement.style.setProperty(
        '--viewport-height',
        `${window.innerHeight}px`
      )
  }

  manageQtyInput(event) {
    let input = event.currentTarget
    if (input.value < 0) input.value = Math.abs(input.value)
    if (input.value.length > 2) input.value = input.value.slice(0, 2)
  }

  /**
   * Observe attribute of component
   *
   * @returns {array} Attributes to Observe
   */
  static get observedAttributes() {
    return ['updating']
  }

  /**
   * To Perform operation when attribute is changed
   * Calls attributeChangedCallback() with params when attribute value is updated
   *
   * @param {string} name attribute name
   * @param {string} oldValue attribute Old value
   * @param {string} newValue attribute latest value
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    // called when one of attributes listed above is modified
    if (name == 'updating' && newValue == 'false') {
      this.updateEvents()
    }
  }

  /**
   * Add accessibility attributes to Open Drawer buttons
   *
   * @param {Node Array} openDrawerButtons Cart Icons
   */
  addAccessibilityAttributes(openDrawerButtons) {
    let _this = this
    openDrawerButtons.forEach((element) => {
      element.setAttribute('role', 'button')
      element.setAttribute('aria-expanded', false)
      element.setAttribute('aria-controls', _this.id)
    })
  }

  /**
   * Escape Click event to close drawer when focused within Cart Drawer
   *
   * @param {event} Event instance
   */
  onKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return
    this.querySelector('.close-ajax--cart').dispatchEvent(new Event('click'))
  }

  /**
   * bind dclick and keyup event to Cart Icons
   * bind keyUp event to Cart drawer component
   * bind Other inside element events
   *
   */
  bindEvents() {
    if (window.globalVariables.template != 'cart') {
      this.openeBy.forEach((cartBtn) =>
        cartBtn.addEventListener('click', this.openCartDrawer.bind(this))
      )
      this.addEventListener('keyup', this.onKeyUp.bind(this))
    }
    // this.updateEvents();
  }

  /**
   * bind Other inside element events to DOM
   *
   */
  updateEvents() {
    this.querySelectorAll('[data-itemRemove]').forEach((button) =>
      button.addEventListener('click', this.removeItem.bind(this))
    )
    this.querySelectorAll('[data-qty-btn]').forEach((button) =>
      button.addEventListener('click', this.manageQtyBtn.bind(this))
    )
    this.querySelectorAll('[data-qty-input]').forEach((button) =>
      button.addEventListener('change', this.onQtyChange.bind(this))
    )
    this.querySelectorAll('[data-gwp-multi-tier]').forEach((button) =>
      button.addEventListener('click', this.openPopup.bind(this))
    )
  }

  addEventListenerUpsells() {
    const upsells = document.querySelectorAll(".cart-upsell");
  
    upsells.forEach((upsell) => {
      const form = upsell.querySelector(".cart-upsell-form");
      const productsToRemove = upsell.getAttribute("data-products-remove").split(",");

      // remove the last element of the array if it's empty
      if (productsToRemove[productsToRemove.length - 1] === "") {
        productsToRemove.pop();
      }

      form.addEventListener("submit", (event) => {
        productsToRemove.forEach((variantId) => {
          setTimeout(() => {
            fetch('/cart/change.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id: variantId,
                quantity: 0
              })
            }).then((response) => {
              if (response.ok) {
                this.getCartData();
              }
            })
          }, 500)
        })
      })
    })
  
  }

  renderUpsells() {
    // Do not include "shopify-section" in the selector, it will break the render
    // Use "?sections={section-id}" to render several sections

    // Fetch a Shopify section. shopify-section only if static section rendered with section tag
    fetch(window.Shopify.routes.root + "?section_id=cart-drawer")
    .then(response => response.text())
    .then(responseText => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const source = html.querySelector('.swiper-container.upsell-test-variant .swiper-wrapper')
        const destination = document.querySelector('.swiper-container.upsell-test-variant .swiper-wrapper')

        const sourceTitle = html.querySelector('.cart-upsell-title.upsell-test-variant')
        const destinationTitle = document.querySelector('.cart-upsell-title.upsell-test-variant')

        destinationTitle.innerHTML = sourceTitle.innerHTML;
        destination.innerHTML = source.innerHTML;


        if (source.children.length == 0) {
          document.querySelector(".cart-upsell-title.upsell-test-variant").style.display = "none";
        } else {
          document.querySelector(".cart-upsell-title.upsell-test-variant").style.display = "block";
        }

        this.addEventListenerUpsells()
    })
    .catch(error => console.error(error));
  }
  /**
   * Open Cart drawer and add focus to drawer container
   *
   * @param {event} Event instance
   */
  openCartDrawer(event) {
    if (!window.globalVariables.cart_drawer) {
      window.location.href = window.routes.cart_fetch_url || '/cart'
      return
    }

    if (
      document
        .querySelector('#mobile-menu-drawer')
        .classList.contains('opened-drawer')
    ) {
      document
        .querySelector('.close-mobile--navbar')
        .dispatchEvent(new Event('click'))
    }

    this.classList.add('opened-drawer')
    siteOverlay.prototype.showOverlay()
    Utility.forceFocus(this.querySelector('.cart-title'))
    let closeBtn = this.querySelector('.close-ajax--cart')
    Utility.trapFocus(this, closeBtn)

    this.renderUpsells()

    if (event) {
      event.preventDefault()
      let openBy = event.currentTarget
      openBy.setAttribute('aria-expanded', true)
    }
  }

  /**
   * Close Cart drawer and Remove focus from drawer container
   *
   * @param {event} Event instance
   */
  closeCartDrawer(event, elementToFocus = false) {
    if (event !== undefined) {
      event.preventDefault()
      this.classList.remove('opened-drawer')
      siteOverlay.prototype.hideOverlay()
      let openByEle = event.currentTarget
      openByEle.setAttribute('aria-expanded', false)
      Utility.removeTrapFocus(elementToFocus)

      let actionBtn = drawerSelectors.cartIconDesktop
      if (window.innerWidth < 1024) {
        actionBtn = drawerSelectors.cartIconMobile
      }
      Utility.forceFocus(actionBtn)
    }
  }

  openPopup(event) {
    var getDivID = event.target.getAttribute('data-gwp-multi-tier')
    document
      .getElementById(getDivID)
      .querySelector('.modal')
      .classList.add('open')
    if (!event.currentTarget.hasAttribute('data-drawer-popup')) {
      siteOverlay.prototype.showOverlay()
    }
    document.querySelector('body').classList.add('gwp-tier-open')
  }

  closePopup(event) {
    event.target.closest('.modal').classList.remove('open')
    console.log('hereee', event.target.closest('.modal'))
    if (!event.currentTarget.hasAttribute('data-drawer-popup')) {
      siteOverlay.prototype.hideOverlay()
    }
    document.querySelector('body').classList.remove('gwp-tier-open')
  }

  /**
   * Update cart HTML and Trigger Open Drawer event
   *
   * @param {string} cartHTML String formatted response from fetch cart.js call
   * @param {string} action Open Drawer as value if need to Open Cart drawer
   */
  _updateCart(response, action) {
    this.setAttribute('updating', true)

    // Convert the HTML string into a document object
    let cartHTML = ''
    if (window.globalVariables.template != 'cart') {
      cartHTML = response['template-cart-drawer']
    } else {
      cartHTML = response['template-cart']
    }

    if (cartHTML == null) return
    let parser = new DOMParser()
    cartHTML = parser.parseFromString(cartHTML, 'text/html')

    let cartJSONEle = cartHTML.querySelector('[data-cartScriptJSON]')
    if (cartJSONEle != undefined && cartJSONEle != null) {
      window.globalVariables.cart = JSON.parse(cartJSONEle.textContent)
    }

    let cartElement = cartHTML.querySelector('ajax-cart form')
    this.querySelector('form').innerHTML = cartElement.innerHTML
    this.querySelector('[data-carttotal]').innerHTML =
      Shopify.formatMoney(
        window.globalVariables.cart.total_price,
        window.globalVariables.money_format
      )

    let removeGWPCElement = cartHTML.querySelector('[data-gwpc-remove]')
    if (typeof removeGWPCElement != 'undefined' && removeGWPCElement != null) {
      var getGWPCIds = removeGWPCElement.getAttribute('data-gwpc-remove')
      this.removeSampleProducts(getGWPCIds)
    }

    let addGwpcElement = cartHTML.querySelector('[data-gwpc-add]')
    if (typeof addGwpcElement != 'undefined' && addGwpcElement != null) {
      var getGWPId = addGwpcElement.getAttribute('data-gwpc-add')
      this.addGWPProduct(getGWPId, 'gwpc')
    }

    let addGwppElement = cartHTML.querySelector('[data-gwpp-add]')
    if (typeof addGwppElement != 'undefined' && addGwppElement != null) {
      var getGWPPId = addGwppElement.getAttribute('data-gwpp-add')
      this.addGWPProduct(getGWPPId, 'gwpp')
    }

    let removeGWPElement = document.querySelector('[data-gwpp-remove]')
    if (typeof removeGWPElement != 'undefined' && removeGWPElement != null) {
      var getGWPPIds = removeGWPElement.getAttribute('data-gwpp-remove')
      this.removeSampleProducts(getGWPPIds)
    }

    let addTier1Element = cartHTML.querySelector('[data-tier1-add]')
    if (typeof addTier1Element != 'undefined' && addTier1Element != null) {
      var getTier1Id = addTier1Element.getAttribute('data-tier1-add')
      this.addGWPProduct(getTier1Id, 'tier1')
    }

    let removeTier1Element = document.querySelector('[data-gwp-remove]')
    if (
      typeof removeTier1Element != 'undefined' &&
      removeTier1Element != null
    ) {
      var getTier1Ids = removeTier1Element.getAttribute('data-gwp-remove')
      this.removeSampleProducts(getTier1Ids)
    }

    let elements = this.querySelectorAll(
      '[data-checkoutBtns], [data-cartnote], [data-cartupsell]'
    )
    if (window.globalVariables.cart.item_count <= 0) {
      elements.forEach((div) => {
        div.classList.add('d-none')
      })
      if (document.querySelector('[data-upsell-product]')) {
        document.querySelector('[data-upsell-product]').classList.add('d-none')
      }
      drawerSelectors.cartDrawerCount.innerHTML = '0'
    } else {
      elements.forEach((div) => {
        div.classList.remove('d-none')
      })
      if (document.querySelector('[data-upsell-product]')) {
        document
          .querySelector('[data-upsell-product]')
          .classList.remove('d-none')
      }
    }
    this.setAttribute('updating', false)

    let headerHTML = new DOMParser().parseFromString(
      response['header'],
      'text/html'
    )
    let cartIcon = headerHTML.getElementById('cart-icon-desktop')
    if (drawerSelectors.cartIconDesktop)
      drawerSelectors.cartIconDesktop.innerHTML = cartIcon.innerHTML
    if (drawerSelectors.cartIconMobile)
      drawerSelectors.cartIconMobile.innerHTML = cartIcon.innerHTML
    if (window.globalVariables.cart.item_count > 0) {
      if (headerHTML.querySelector('#cart-icon-desktop .cart-count')) {
        if (drawerSelectors.cartDrawerCount)
          drawerSelectors.cartDrawerCount.innerHTML = headerHTML.querySelector(
            '#cart-icon-desktop .cart-count'
          ).innerHTML
      }
    }

    this.qtyInputs = this.querySelectorAll('input[data-qty-input]')
    this.qtyInputs.forEach((qtyInput) => {
      qtyInput.addEventListener('keyup', this.manageQtyInput.bind(this))
    })

    if (
      window.globalVariables.cart_drawer &&
      action == 'open_drawer' &&
      window.globalVariables.template != 'cart'
    ) {
      this.openCartDrawer()
    }

    // Extend - Dispatch event
    window.setTimeout(function () {
      window.dispatchEvent(new Event('refreshAjaxCart'))
      window.dispatchEvent(new Event('refreshAjaxSideCart'))
    }, 500)
    // Extend - End code
  }

  addGWPProduct(id, gwp_type) {
    if (gwp_type == 'gwpc') {
      var body = {
        id: parseInt(id),
        quantity: 1,
        properties: {
          product_type: 'gwpc',
          free_product: 'true',
        },
      }
    } else if (gwp_type == 'gwpp') {
      var body = {
        id: parseInt(id),
        quantity: 1,
        properties: {
          product_type: 'gwpp',
          free_product: 'true',
        },
      }
    } else if (gwp_type == 'tier1') {
      var body = {
        id: parseInt(id),
        quantity: 1,
        properties: {
          product_type: 'tier1',
          free_product: 'true',
        },
      }
    }

    const result = fetch('/cart/add.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    }).then((response) => {
      document.querySelector('ajax-cart').getCartData()
    })
  }

  addMultiGWPProduct(event) {
    event.preventDefault()
    event.stopPropagation()
    console.log('callllll')
    let currentTarget = event.currentTarget
    let upsellProductVariantId =
      currentTarget.getAttribute('add-gwp-product') || null
    var closeBtn = currentTarget.closest('.modal').querySelector('.close-popup')
    var gwpType = currentTarget.getAttribute('data-gwp-type')

    // currentTarget.setAttribute('disabled', true);
    currentTarget.classList.add('loading')
    // currentTarget.querySelector('[data-btn-txt]').classList.add('d-none');
    var allBtns = currentTarget
      .closest('.modal')
      .querySelectorAll('[add-gwp-product]')
    allBtns.forEach((button) => button.classList.add('disable-element'))

    if (gwpType == 'tier1') {
      var body = {
        id: parseInt(upsellProductVariantId),
        quantity: 1,
        properties: {
          product_type: 'tier1',
          free_product: 'true',
        },
      }
    }

    const result = fetch('/cart/add.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    }).then((response) => {
      allBtns.forEach((button) => button.classList.remove('disable-element'))
      // currentTarget.setAttribute('disabled', false);
      currentTarget.classList.remove('loading')
      // currentTarget.querySelector('[data-btn-txt]').classList.remove('d-none');
      closeBtn.click()
      document.querySelector('ajax-cart').getCartData()
    })
  }

  removeSampleProducts(ids) {
    var varArray = ids.split(',')
    var data = {}

    for (let index = 0; index < varArray.length; ++index) {
      data[varArray[index]] = 0

      if (index == varArray.length - 1) {
        const result = fetch('/cart/update.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ updates: data }),
        }).then((response) => {
          document.querySelector('ajax-cart').getCartData()
        })
      }
    }
  }

  /**
   * Fetch latest cart data
   *
   * @param {string} action Open Drawer as value if need to Open Cart drawer or else let it be empty
   */
  getCartData(action) {
    let cartRoute = `${routes.cart_fetch_url}?sections=template-cart,header`
    if (window.globalVariables.template != 'cart') {
      cartRoute = `${routes.cart_fetch_url}?sections=template-cart-drawer,header`
    }

    fetch(cartRoute)
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this._updateCart(response, action)
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        // Cart HTML fetch done
      })
  }

  /**
   * Update Quantity API call
   *
   * @param {string} line Line Index value of cart Item (Starts from 1)
   * @param {integer} quantity Quantity to update
   */
  updateItemQty(line, quantity) {
    let lineItem = document.querySelector(`[data-cart-item="${line}"]`)
    if (lineItem) {
      lineItem.classList.add('updating')
    }
    var body = {}
    body[line] = quantity
    body = JSON.stringify({ updates: body })

    fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text()
      })
      .then((state) => {
        this.getCartData()
        setTimeout(() => {
          if (lineItem) {
            lineItem.classList.remove('updating')
          }
        }, 1000)
      })
      .catch((error) => {
        setTimeout(() => {
          if (lineItem) {
            lineItem.classList.remove('updating')
          }
        }, 1000)
        console.log(error)
      })
  }

  /**
   * Remove Item Event
   *
   * @param {event} Event instance
   */
  removeItem(event) {
    event.preventDefault()
    let currentTarget = event.currentTarget
    let itemIndex = currentTarget.dataset.index || null
    if (itemIndex != null) {
      this.updateItemQty(itemIndex, 0)
    }
  }

  /**
   * Cart Item Qunatity Increment/Decrement Button event
   *
   * @param {event} Event instance
   */
  manageQtyBtn(event) {
    event.preventDefault()
    let currentTarget = event.currentTarget
    let action = currentTarget.dataset.for || 'increase'
    let $qtyInput = currentTarget
      .closest('[data-qty-container]')
      .querySelector('[data-qty-input]')
    let itemIndex = $qtyInput.dataset.index || 1
    let currentQty = parseInt($qtyInput.value) || 1
    let finalQty = 1

    if (action == 'decrease' && currentQty <= 1) {
      return false
    } else if (action == 'decrease') {
      finalQty = currentQty - 1
    } else {
      finalQty = currentQty + 1
    }
    this.updateItemQty(itemIndex, finalQty)
  }

  /**
   * Cart Item Qunatity Input change event
   *
   * @param {event} Event instance
   */
  onQtyChange(event) {
    const $qtyInput = event.currentTarget
    const qtyValue = $qtyInput.value
    const itemIndex = $qtyInput.dataset.index || null
    if (itemIndex) this.updateItemQty(itemIndex, qtyValue)
  }

  /**
   * Manage Cart Notes
   */
  cartNoteInput() {
    const cartNoteEle = document.querySelector('[data-cartNote] [name="note"]')
    if (!cartNoteEle) return

    const cartNoteSave = document.querySelector('[data-saveNote]')
    let cartNoteEvents = ['input', 'paste']
    cartNoteEvents.forEach((eventName) => {
      cartNoteEle.addEventListener(
        eventName,
        () => {
          const defaultNote = cartNoteEle.dataset.default
          if (defaultNote != cartNoteEle.value) {
            cartNoteSave.style.display = 'block'
          } else {
            cartNoteSave.style.display = 'none'
          }
        },
        false
      )
    })

    //  Cart Note Change event
    cartNoteSave.addEventListener('click', (e) => {
      e.preventDefault()
      const currentTarget = e.currentTarget
      const cartNoteContainer = currentTarget.closest('[data-cartNote]')
      const cartNote = cartNoteContainer
        .querySelector('[name="note"]')
        .value.trim()
      if (cartNote.length <= 0) {
        alert('Add Note before proceeding')
        return
      }
      const submitBtn = cartNoteContainer.querySelector('[data-saveNote]')
      const waitText = submitBtn.dataset.adding_txt
        ? submitBtn.dataset.adding_txt
        : 'Saving...'
      submitBtn.innerHTML = waitText
      submitBtn.disabled = true
      this.updateCartNote(cartNoteContainer)
    })
  }

  /**
   * Update Cart Note
   * @param {element} cartNoteContainer
   */
  updateCartNote(cartNoteContainer) {
    const _this = this
    const cartNoteEle = cartNoteContainer.querySelector('[name="note"]')
    const cartNote = cartNoteEle.value.trim()
    const resultEle = cartNoteContainer.querySelector('[data-resultMsg]')
    const submitBtn = cartNoteContainer.querySelector('[data-saveNote]')
    const defaultText = submitBtn.dataset.default
      ? submitBtn.dataset.default
      : 'Save'

    let body = JSON.stringify({
      note: cartNote,
    })
    fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } })
      .then(function (data) {
        if (data.status == 200) {
          if (resultEle) {
            resultEle.innerText = 'Added note to Order!'
            _this.manageResponseText(resultEle)
          }
          if (cartNoteEle) {
            cartNoteEle.dataset.default = cartNote
          }
          submitBtn.style.display = 'none'
          submitBtn.innerHTML = defaultText
          submitBtn.disabled = false
        } else {
          console.error('Request returned an error', data)
          if (resultEle) {
            resultEle.innerText = data
            _this.manageResponseText(resultEle)
          }
          submitBtn.innerHTML = defaultText
          submitBtn.disabled = false
        }
      })
      .catch(function (error) {
        console.error('Request failed', error)
        if (resultEle) {
          resultEle.innerText = error
          _this.manageResponseText(resultEle)
        }
        submitBtn.innerHTML = defaultText
        submitBtn.disabled = false
      })
  }

  /**
   * fade effect on reponse
   * @param {element} element
   */
  manageResponseText(element) {
    Utility.fadeEffect(element, 'fadeIn')
    setTimeout(() => {
      Utility.fadeEffect(element, 'fadeOut')
    }, 3000)
  }
}
customElements.define('ajax-cart', AjaxCart)
