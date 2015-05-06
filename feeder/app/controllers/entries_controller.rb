class EntriesController < ApplicationController
  before_action :set_feed, only: [:show, :edit, :update, :destroy]

  # GET /entries
  # GET /entries.json
  def index
    @entries = Entry.all
  end

  # GET /entries/1
  # GET /entries/1.json
  def show
  end

  # GET /entries/new
  def new
    @entry = Entry.new
  end

  # GET /feeds/1/edit
  def edit
  end

  # GET /feeds/add
  def add

  end

  # POST /feeds
  # POST /feeds.json
  def create
  end

  # PATCH/PUT /feeds/1
  # PATCH/PUT /feeds/1.json
  def update
  end

  # DELETE /feeds/1
  # DELETE /feeds/1.json
  def destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_entry
      @entry = Entry.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def feed_params
      params.require(:feed).permit(:feed_link, :source_link, :title, :description, :updated, :subtitle, :icon)
    end
end
