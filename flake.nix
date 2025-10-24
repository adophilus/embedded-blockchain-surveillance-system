{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
    foundry.url =
      "github:shazow/foundry.nix/stable"; # Use stable branch for permanent releases
  };

  outputs = { self, nixpkgs, utils, foundry }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ foundry.overlay ];
        };
        wrapWithMissingLibraries = binaryFile:
          pkgs.writeShellScriptBin (baseNameOf binaryFile) ''
            LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath [ pkgs.libuuid ]}";
            export LD_LIBRARY_PATH
            exec ${binaryFile} "$@";
          '';
        node = wrapWithMissingLibraries (nixpkgs.lib.getExe pkgs.nodejs_22);
      in {

        devShell = with pkgs;
          mkShell {
            buildInputs = [
              # From the foundry overlay
              # Note: Can also be referenced without overlaying as: foundry.defaultPackage.${system}
              foundry-bin

              # ... any other dependencies we need
              solc

              # nodejs_22
              node
              pnpm_10

              kubo

              libuuid
            ];

            # Decorative prompt override so we know when we're in a dev shell
            # shellHook = ''
            #   export PS1="[dev] $PS1"
            # '';
          };
      });
}
