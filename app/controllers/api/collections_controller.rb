class NoSoundsError < StandardError
end

class Api::CollectionsController < ApplicationController
  def index
    if params[:user_id]
      @collections = Collection.includes(:user).includes(:sounds).includes(:tags).where(user_id: params[:user_id])
    elsif params['tag'] && params['tag'] != 'all'
      tag = Tag.where(name: params['tag']).first
      @collections = tag.collections.includes(:user).includes(:sounds).includes(:tags)
    else
      @collections = Collection.includes(:user).includes(:sounds).includes(:tags).all
    end
  end

  def search
    @collections = Collection.search(params[:query])
    render 'api/collections/index'
  end

  def show
    @collection = Collection.find(params[:id])
    if @collection
      render :show
    else
      render json: { base: ['Collection does not exist'] }, status: 404
    end
  end

  def create
    @collection = Collection.new(collection_params)
    begin
      ActiveRecord::Base.transaction do
        if @collection.save
          parse_and_save_sounds
          render 'api/collections/show'
        else
          render json: @collection.errors, status: 422
        end
      end
    rescue ActiveRecord::RecordInvalid => exception
      render json: { sounds: exception.message[19..-1].split(', ') }, status: 422
    rescue NoSoundsError => exception
      render json: { sounds: ['Must have at least one sound.'] }, status: 422
    end
  end

  def update
    @collection = Collection.find(params[:id])
    begin
      ActiveRecord::Base.transaction do
        if @collection.update(collection_params)
          parse_and_save_sounds
          render 'api/collections/show'
        else
          render json: @collection.errors, status: 422
        end
      end
    rescue ActiveRecord::RecordInvalid => exception
      render json: { sounds: exception.message[19..-1].split(', ') }, status: 422
    rescue NoSoundsError => exception
      render json: { sounds: ['Must have at least one sound.'] }, status: 422
    end
  end

  def destroy
    @collection = Collection.find(params[:id])
    @collection.destroy
    render json: {}
  end

  private
  def collection_params
    result = params.require(:collection).permit(:title, :description, :user_id)
    tag_ids = []
    params[:collection][:tags].delete(' ').split(',').each do |str|
      tag = Tag.where(name: str).first
      tag_ids.push(tag.id) if tag
    end
    result = result.merge(tag_ids: tag_ids)
    if params[:collection][:artwork] != 'null'
      return result.merge(artwork: params[:collection][:artwork])
    else
      return result
    end
  end

  def parse_and_save_sounds
    sounds = JSON.parse(params[:collection][:sounds])
    raise NoSoundsError if sounds.length == 0
    sounds.each_with_index do |sound, idx|
      if sound['id']
        Sound.find(sound['id']).update!(
          id: sound['id'],
          title: sound['title'],
          description: sound['description'],
        )
      else
        Sound.create!(
          title: sound['title'],
          description: sound['description'],
          audio: params[:collection]["audio#{idx}"],
          collection_id: @collection.id
        )
      end
    end
  end
end
