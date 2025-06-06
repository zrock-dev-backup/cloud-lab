{
  description = "Development environment with Node.js 20";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_24
          ];

          shellHook = ''
            echo "Node.js development environment ready!"
            echo "Run 'npm run dev' to start your development server"
          '';
        };

        packages.dev-script = pkgs.writeShellApplication {
        name = "dev-script";
        runtimeInputs = [ pkgs.nodejs_24 ];
        text = ''
        nohup npm run dev &
        '';
        };

        packages.webstorm = pkgs.writeShellApplication {
        name = "webstorm";
        runtimeInputs = [ pkgs.nodejs_24 ];
        text = ''
          nohup /home/zrock/.local/bin/webstorm . > /dev/null 2>&1 &
        '';
        };
      }
    );
}
