{
  pkgs,
  lib,
  config,
  inputs,
  ...
}: {
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs;
    npm.install.enable = true;
  };
  languages.typescript.enable = true;

  pre-commit.hooks.eslint = {
    enable = true;
    package = null;
    entry = "npx eslint --fix";
    files = "\\.(ts|js)$";
  };

  pre-commit.hooks.prettier = {
    enable = true;
    package = null;
    entry = "npx prettier --write";
    files = "\\.(ts|m?js|json|ya?ml|md)$";
  };

  pre-commit.hooks.alejandra.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
