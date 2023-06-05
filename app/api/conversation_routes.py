from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Conversation, Message
from datetime import datetime

conversation_routes = Blueprint('conversations', __name__)


# Get conversation for the current user
@conversation_routes.route('', methods=['GET'])
@login_required
def get_conversation():
    # Query for the conversation associated with the current user
    conversation = Conversation.query.filter_by(user_id=current_user.id).first()

    if not conversation:
        return jsonify(error="Conversation not found"), 404

    # associated messages
    messages = Message.query.filter_by(conversation_id=conversation.id).all()

    # Convert to dictionaries
    conversation_data = conversation.to_dict()
    messages_data = [message.to_dict() for message in messages]

    # Add the messages to the conversation dictionary
    conversation_data['messages'] = messages_data

    return conversation_data


# Update conversation by id
@conversation_routes.route('/<int:id>', methods=['PUT'])
def update_conversation(id):
    # Query for conversation by id and update that conversation
    conversation = Conversation.query.get(id)

    if not conversation:
       return jsonify(error=[f"Unable to find conversation associated with id {id}"])

    if conversation.user_id != current_user.id:
        return jsonify(error=["You don't have the permission to update this conversation"]), 401

    title = request.json.get('title')
    

    conversation.title = title or conversation.title
    conversation.updated_at = datetime.now()

    db.session.commit()

    return conversation.to_dict(), 200

@conversation_routes.route('', methods=['POST'])
def post_conversation():
    # Request information from json request and create new conversation
    if not current_user:
        return jsonify(error="You must be logged in to create a conversation"), 401

    # Check if user already has a conversation
    existing_conversation = Conversation.query.filter_by(user_id=current_user.id).first()
    if existing_conversation:
        return jsonify(error="You already have a conversation"), 400

    title = request.json.get('title')
    user_id = current_user.id   

    new_conversation = Conversation(
        title=title,
        user_id=user_id,
    )

    db.session.add(new_conversation)
    db.session.commit()

    return new_conversation.to_dict(), 201



# Delete conversation by id
@conversation_routes.route('/<int:id>', methods=['DELETE'])
def delete_conversation(id):
    # Query for a conversation by id and delete the associated messages
    conversation = Conversation.query.get(id)
    
    if not conversation:
       return jsonify(error=[f"Unable to find conversation associated with id {id}"])

    if conversation.user_id != current_user.id:
        return jsonify(error=["You don't have the permission to delete this conversation"]), 401

    # Delete all messages associated with the conversation
    Message.query.filter_by(conversation_id=id).delete()

    # Delete the conversation
    db.session.delete(conversation)

    db.session.commit()

    return {"deleted conversation and messages": conversation.to_dict()}

