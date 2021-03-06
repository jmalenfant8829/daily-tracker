"""empty message

Revision ID: 492c7eef4538
Revises: 60053932e2ce
Create Date: 2021-06-02 10:44:35.456251

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '492c7eef4538'
down_revision = '60053932e2ce'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_user_email', table_name='user')
    op.drop_column('user', 'email')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('email', sa.VARCHAR(length=120), autoincrement=False, nullable=False))
    op.create_index('ix_user_email', 'user', ['email'], unique=False)
    # ### end Alembic commands ###
