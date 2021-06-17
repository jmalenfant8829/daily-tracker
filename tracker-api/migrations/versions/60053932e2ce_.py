"""empty message

Revision ID: 60053932e2ce
Revises: 0402b2f63103
Create Date: 2021-06-01 13:49:32.811160

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '60053932e2ce'
down_revision = '0402b2f63103'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('task',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(length=64), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_task_name'), 'task', ['name'], unique=False)
    op.create_table('daily_task_time',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('task_id', sa.Integer(), nullable=True),
    sa.Column('daily_target_minutes', sa.Integer(), nullable=False),
    sa.Column('day', sa.Date(), nullable=False),
    sa.Column('minutes_spent', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['task_id'], ['task.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('user', sa.Column('default_daily_target_min', sa.Integer(), nullable=False))
    op.alter_column('user', 'username',
               existing_type=sa.VARCHAR(length=64),
               nullable=False)
    op.alter_column('user', 'email',
               existing_type=sa.VARCHAR(length=120),
               nullable=False)
    op.alter_column('user', 'hash',
               existing_type=sa.VARCHAR(length=128),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('user', 'hash',
               existing_type=sa.VARCHAR(length=128),
               nullable=True)
    op.alter_column('user', 'email',
               existing_type=sa.VARCHAR(length=120),
               nullable=True)
    op.alter_column('user', 'username',
               existing_type=sa.VARCHAR(length=64),
               nullable=True)
    op.drop_column('user', 'default_daily_target_min')
    op.drop_table('daily_task_time')
    op.drop_index(op.f('ix_task_name'), table_name='task')
    op.drop_table('task')
    # ### end Alembic commands ###