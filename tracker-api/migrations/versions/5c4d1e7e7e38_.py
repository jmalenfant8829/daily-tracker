"""empty message

Revision ID: 5c4d1e7e7e38
Revises: cd046d7dc0af
Create Date: 2021-06-18 09:10:25.315058

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5c4d1e7e7e38'
down_revision = 'cd046d7dc0af'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'task', ['user_id', 'name'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'task', type_='unique')
    # ### end Alembic commands ###
