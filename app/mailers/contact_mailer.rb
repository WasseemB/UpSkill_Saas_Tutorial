class ContactMailer < ActionMailer::base
  default to: 'the.waswas@gmail.com'
  
  def contact_email(name,email,comments)
    @name = name
    @email = email
    @comments = comments
    
    mail(from:email,subject:'Contact form message')
  end
end