#!/bin/bash

# Ghost Development Environment with Podman
# This script sets up a containerized Ghost instance for FrameGrid theme development

set -e

# Configuration
CONTAINER_NAME="ghost-dev"
GHOST_PORT="2368"
HOST_PORT="2368"
GHOST_IMAGE="ghost:latest"
DATA_VOLUME="ghost-dev-data"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

echo_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

echo_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Podman is installed
check_podman() {
    if ! command -v podman &> /dev/null; then
        echo_error "Podman is not installed. Please install Podman first."
        exit 1
    fi
    echo_info "Podman found: $(podman --version)"
}

# Function to pull Ghost image if not present
pull_ghost_image() {
    echo_info "Checking for Ghost image..."
    if ! podman image exists "$GHOST_IMAGE"; then
        echo_info "Pulling Ghost image: $GHOST_IMAGE"
        podman pull "$GHOST_IMAGE"
        echo_success "Ghost image pulled successfully"
    else
        echo_info "Ghost image already exists"
    fi
}

# Function to stop and remove existing container
cleanup_existing_container() {
    echo_info "Checking for existing container: $CONTAINER_NAME"

    if podman container exists "$CONTAINER_NAME"; then
        echo_warning "Stopping existing container: $CONTAINER_NAME"
        podman stop "$CONTAINER_NAME" 2>/dev/null || true

        echo_warning "Removing existing container: $CONTAINER_NAME"
        podman rm "$CONTAINER_NAME" 2>/dev/null || true
        echo_success "Existing container cleaned up"
    else
        echo_info "No existing container found"
    fi
}

# Function to create data volume if it doesn't exist
setup_data_volume() {
    echo_info "Setting up data volume: $DATA_VOLUME"

    if ! podman volume exists "$DATA_VOLUME"; then
        podman volume create "$DATA_VOLUME"
        echo_success "Data volume created: $DATA_VOLUME"
    else
        echo_info "Data volume already exists: $DATA_VOLUME"
    fi
}

# Function to create theme directory structure
setup_theme_directories() {
    echo_info "Setting up theme directory structure..."

    # Create content/themes directory if it doesn't exist
    mkdir -p content/themes/framegrid
    echo_success "Theme directories created"
}

# Function to start Ghost container
start_ghost_container() {
    echo_info "Starting Ghost development container..."

    # Get the absolute path to the current directory
    CURRENT_DIR=$(pwd)

    podman run -d \
        --name "$CONTAINER_NAME" \
        --publish "${HOST_PORT}:${GHOST_PORT}" \
        --volume "${CURRENT_DIR}/content:/var/lib/ghost/content:Z" \
        --volume "${DATA_VOLUME}:/var/lib/ghost/content/data:Z" \
        --env NODE_ENV=development \
        --env database__client=sqlite3 \
        --env database__connection__filename=/var/lib/ghost/content/data/ghost.db \
        --env url=http://localhost:${HOST_PORT} \
        "$GHOST_IMAGE"

    echo_success "Ghost container started successfully"
}

# Function to wait for Ghost to be ready
wait_for_ghost() {
    echo_info "Waiting for Ghost to be ready..."

    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s "http://localhost:${HOST_PORT}" > /dev/null 2>&1; then
            echo_success "Ghost is ready!"
            break
        fi

        echo_info "Attempt $attempt/$max_attempts: Ghost not ready yet, waiting 2 seconds..."
        sleep 2
        ((attempt++))
    done

    if [ $attempt -gt $max_attempts ]; then
        echo_error "Ghost failed to start within expected time"
        echo_info "Check container logs with: podman logs $CONTAINER_NAME"
        exit 1
    fi
}

# Function to show useful information
show_info() {
    echo
    echo_success "=== Ghost Development Environment Ready ==="
    echo_info "Ghost URL: http://localhost:${HOST_PORT}"
    echo_info "Admin URL: http://localhost:${HOST_PORT}/ghost"
    echo_info "Container name: $CONTAINER_NAME"
    echo
    echo_info "Useful commands:"
    echo "  View logs: podman logs -f $CONTAINER_NAME"
    echo "  Stop: podman stop $CONTAINER_NAME"
    echo "  Restart: podman restart $CONTAINER_NAME"
    echo "  Shell access: podman exec -it $CONTAINER_NAME /bin/bash"
    echo
    echo_info "Theme development:"
    echo "  Theme files: ./content/themes/framegrid/"
    echo "  Changes will be reflected automatically"
    echo
}

# Main execution
main() {
    echo_info "Starting Ghost development environment setup..."
    echo

    check_podman
    pull_ghost_image
    cleanup_existing_container
    setup_data_volume
    setup_theme_directories
    start_ghost_container
    wait_for_ghost
    show_info
}

# Run main function
main
