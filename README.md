# wab - Watch auth, bitch!

My own playground for authenticating.


# Directory structure

Directories are organized according to the technology set they are written in.
The `old` folder contains the first version of this repo, with a sample system
that is no longer maintained. It might be removed in the future.


# Generic structure

## Web

The web version should provide the following pages:
  - Home Page -> public content, no authentication required;
  - Login / Sign up Page:
    - Should provide a local registration and login;
    - Should also provide login via third party systems, like github, twitter,
      etc., this is secondary.
  - Profile Page -> requires authentication, should not be accessible for
    non-authenticated users and contains a logout button.

## API

There should also be an API that allows an app to authenticate as an existing
user, by using its credentials.

A second version that would be nice is to add the possibility to create or
register an app, and provide authentication for it. This is also secondary, in
terms of relevance.
