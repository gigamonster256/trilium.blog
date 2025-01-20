{
  pkgs,
  lib,
  config,
  inputs,
  ...
}: {
  languages.javascript.enable = true;

  pre-commit.hooks.eslint = {
    enable = true;
    entry = "npx eslint";
    files = "\\.(ts|js)$";
  };

  pre-commit.hooks.prettier = {
    enable = true;
    entry = "npx prettier -w";
    files = "\\.(ts|m?js|json|ya?ml|md)$";
  };

  pre-commit.hooks.alejandra.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
