# Miur — where the project stands

*Written for someone who doesn't code. Last updated 31 July 2026.*

---

## The short version

The shop is built. **It cannot take money yet.**

That's not a figure of speech. If a customer went through the whole ordering
process today, they'd reach a "thank you" page, we'd have a record of their
order — and no payment would have been taken, and no parcel would ever be sent.

Everything else is either done or close to it. This one gap is the difference
between what exists now and a shop that can open.

---

## What works today

Imagine a customer visiting the site. Everything below already works:

**Browsing.** The site is built, styled and finished. There are now **25,652
real products** in it, imported directly from the supplier — with real names,
descriptions, prices, photos, categories and stock levels. Not placeholders.

**Searching.** They can type "zel" and find "żel", or misspell "wibratr" and
still get the right products. It handles Polish accents and typos, and returns
results in a few thousandths of a second.

**The cart.** Add things, close the browser, come back tomorrow — the cart is
still there. If they had items in the cart before logging in, those get merged
into their account rather than lost.

**Accounts.** Register, log in, forget your password and reset it by email.

**Checkout.** A full form: name, email, phone, and either a courier address or
a pick-up locker chosen from an InPost map. All the legally required consent
checkboxes are there.

**Emails.** After ordering, the customer gets a confirmation email in Polish
containing everything Polish consumer law requires — itemised prices, delivery
details, and the notice about their right to cancel within 14 days.

**The legal groundwork.** Age verification, cookie consent, privacy policy,
terms, returns policy. Discreet packaging and an anonymous sender name are built
into how orders and emails work.

---

## What doesn't work yet

### The blocker: taking payment

There is no payment step. The customer clicks "go to payment" and the order is
simply recorded, unpaid.

Tied to this is a second problem that matters specifically because of how the
business works. **We don't own any stock** — the supplier does. So there will
always be a gap between "customer paid us" and "supplier confirms they can
actually ship it." Sometimes they won't have it. Right now nothing would give
that customer their money back.

Both of these are the same piece of work. It's the next thing being built.

### Smaller gaps

**No shipping labels.** The map where customers pick a locker works, but the
system can't yet buy the actual postage. Waiting on an account with InPost.

**No admin screen.** There's no page where you can look at incoming orders,
change their status, or mark something as shipped. Right now that would mean
looking directly in the database.

**Photos are still on the supplier's servers.** We're allowed to use the images
but not to link to them directly, so they need copying onto our own hosting.

**Invoices.** Waiting on a decision about which system handles them.

**Security hardening.** One example: right now someone could try thousands of
password guesses against the login page without being slowed down. Normal
protection against that isn't in place yet.

**Accessibility check.** EU law requires online shops to be usable by people
with disabilities. This hasn't been formally tested yet, and it isn't optional.

---

## What happens next, in order

**1. Payments.** The big one. Roughly a week of work, and it includes the
automatic refund when the supplier can't fulfil an order.

It also includes a deliberate 15-minute pause after payment, during which the
customer can still cancel. That's worth explaining: for sealed intimate
products, we're legally allowed to refuse returns once opened. So if someone
changes their mind ten minutes after ordering, without that pause we'd be stuck
choosing between an unhappy customer and a product we can't resell. A short
window costs nothing and avoids the whole problem.

**2. Profit tracking.** The system currently records what the customer paid but
not what we paid the supplier — meaning "did we make money today" is currently
unanswerable. Quick to add, and much harder to add later.

**3. Shipping labels.** A few days once the InPost account is approved.

**4. Admin screen.** So orders can actually be managed day to day.

**5. Product photos** onto our own hosting.

**6. Final checks** before launch — security, accessibility, and automated
tests that catch mistakes before they reach customers.

---

## What we're waiting on from other people

None of these are coding tasks. They take days of *someone else's* time, so the
sooner they start, the less waiting there is later.

| What | How long | Why it matters |
|---|---|---|
| **Przelewy24 test account** | 1–3 days | Blocks payments — so it blocks opening the shop. **Start this first.** |
| InPost merchant account | 1–2 days | Blocks printing postage |
| Which invoicing system, and does it produce real invoices | — | Blocks the invoice step |
| Access to the miur.pl domain settings | 10 minutes | Until this is done, emails send from a temporary address and some will land in spam |

One that used to be a worry: **supplier access is sorted.** Getting the product
feed from erotizo could have taken weeks of back-and-forth. It's working, and
the full catalogue is already imported.

---

## An honest note on pricing

Every price currently on the site is calculated by doubling what the supplier
charges, then adding VAT. So a product costing 22,12 zł is listed at 54,42 zł.

**That multiplier was chosen to produce reasonable-looking numbers, not because
anyone researched the market.** The supplier gives no recommended retail price,
so this is entirely a business decision, and it should be made deliberately
before launch. It can be changed globally or per product.

---

## Roughly how long

The payment work is about a week. The remaining pieces after that are a few
weeks more, depending on how much time goes into it and how quickly the accounts
above get approved.

The honest summary: **the shop is built, the money side isn't.** That's a
smaller remaining job than it sounds, but it's the one that decides whether the
site is a shop or a catalogue.

---

*A detailed technical version of this lives in MIUR_PROJECT_STATUS.md.*
