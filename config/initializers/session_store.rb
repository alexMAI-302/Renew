# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_RailsRenew_session',
  :secret      => '27124ae444c8433f27d71f3db258ef26d807718e70678fadf7f42d6abd68d4043f19b9177d83e29bb5d330624debada86e09fc271c71fa55a970334b94c2bc61'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
ActionController::Base.session_store = :active_record_store
